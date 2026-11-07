// Run against a local preview: PURELINE_TEST_BASE_URL=http://127.0.0.1:8765 node tests/blog-visibility.mjs
// Set PLAYWRIGHT_MODULE to an installed Playwright module path if it is not available locally.
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseUrl=process.env.PURELINE_TEST_BASE_URL || 'http://127.0.0.1:8765';
const browser=await chromium.launch({headless:true});
const results=[];
for(const width of [1440,768,390,375,320])for(const mode of ['normal','blocked-script','no-javascript']){
 const ctx=await browser.newContext({viewport:{width,height:1000},javaScriptEnabled:mode!=='no-javascript'});
 const page=await ctx.newPage();
 await page.route('https://www.googletagmanager.com/**',r=>r.abort());
 if(mode==='blocked-script')await page.route('**/js/script.js',r=>r.abort());
 await page.goto(new URL('/blog/',baseUrl).href,{waitUntil:'networkidle'});await page.waitForTimeout(1100);
 const r=await page.evaluate(()=>{
  const cards=[...document.querySelectorAll('a.blog-card')];
  const visible=cards.filter(e=>{for(let el=e;el;el=el.parentElement){const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;}return true;});
  return {total:cards.length,visible:visible.length,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,firstHref:cards[0]?.getAttribute('href')};
 });

 results.push({width,mode,...r});console.log(JSON.stringify(results.at(-1)));
 if(mode==='normal' && width<=768){
  await page.locator('.burger').click();
  if(await page.locator('.burger').getAttribute('aria-expanded')!=='true')throw Error('Mobile menu did not open');
  await page.keyboard.press('Escape');
  if(await page.locator('.burger').getAttribute('aria-expanded')!=='false')throw Error('Mobile menu did not close');
 }
 await page.locator('a.blog-card').last().scrollIntoViewIfNeeded();
 if(await page.locator('a.blog-card').last().evaluate(el=>getComputedStyle(el).opacity)!=='1')throw Error('Last article is hidden');
 await page.locator('a.blog-card').first().click();
 await page.waitForURL(new URL(r.firstHref,baseUrl).href);
 if(await page.locator('article h1').count()!==1)throw Error('Article link failed');
 await ctx.close();
}
await browser.close();
if(results.some(r=>r.total<43||r.visible!==r.total||r.scroll>r.client+1))process.exitCode=1;
