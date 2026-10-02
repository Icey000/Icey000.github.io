(() => {
 if (!(location.protocol === 'file:' || ['localhost','127.0.0.1'].includes(location.hostname))) return;
 const bar = document.getElementById('local-tools');bar.hidden=false;
 const main=document.querySelector('main');const edit=document.getElementById('edit');
 const message=document.getElementById('edit-message');let dirty=false;
 edit.addEventListener('click',()=>{const active=main.contentEditable!=='true';main.contentEditable=String(active);edit.textContent=active?'Finish editing':'Edit this page';message.textContent=active?'Click the article to edit. Download it when finished, then replace the original file.':'Download the page to save changes. Unsaved edits will be lost on reload.';});
 main.addEventListener('input',()=>{dirty=true});
 document.getElementById('save').addEventListener('click',()=>{
 const clone=document.documentElement.cloneNode(true);clone.querySelector('main').removeAttribute('contenteditable');
 clone.querySelector('#local-tools').hidden=true;clone.querySelector('#edit').textContent='Edit this page';
 const blob=new Blob(['<!DOCTYPE html>\n'+clone.outerHTML],{type:'text/html;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=decodeURIComponent(location.pathname.split('/').pop())||'index.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);dirty=false;message.textContent='Download requested. Replace the original HTML file with the downloaded file before uploading.';
 });
 document.getElementById('photo-input').addEventListener('change',event=>{
 const file=event.target.files[0];if(!file)return;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){message.textContent='Choose a PNG, JPG or WebP image up to 5 MB.';return;}
 const reader=new FileReader();reader.onload=()=>{const fig=document.createElement('figure'),img=document.createElement('img'),cap=document.createElement('figcaption');img.src=reader.result;img.alt='Experiment or observation screenshot';cap.textContent='Add a description, the actual date and what this image demonstrates.';fig.append(img,cap);main.append(fig);dirty=true;message.textContent='Image added at the end of the article. Edit the caption, then download to save.';};reader.readAsDataURL(file);event.target.value='';
 });
 window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
})();
