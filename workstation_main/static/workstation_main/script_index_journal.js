let curr_date=new Date();
addEventListener("DOMContentLoaded",()=>{
    toggle('form');
  
    if(typeof(Storage)!=undefined)
    {
        console.log("you got storage");
       // let curr_date=new Date();
        let d=localStorage.getItem(`data_journal${curr_date.toLocaleDateString()}`);
    get_content(curr_date); 
    document.getElementById('prev').addEventListener('click',()=>{nav_journal('prev',curr_date);});
    document.getElementById('today').addEventListener('click',()=>{nav_journal('today', curr_date);});
    document.getElementById('next').addEventListener('click',()=>{nav_journal('next',curr_date);});
    }   
    else
    {
        console.log("Sorry no storage");
        
    }
   

    document.getElementById('form').onchange=()=>{store_journal_data();};
    document.getElementById('search_btn').onclick=()=>{
        fetch(`/search/${document.getElementById('search').value}`)
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            show_playlist(data);
            })

    }
   document.getElementById('today-goal').onclick=()=>{
       let parent_div=document.getElementById('goals-div');
       let n=parent_div.getElementsByClassName('form-check').length;
       parent_div.insertAdjacentHTML("beforeend",
       `<div class="input-group mb-3">
       <div class="input-group-text">
 <input class="form-check-input mt-0 form-data-goals" type="checkbox" id="c${n+1}"name="c${n+1}" value="c${n+1}" aria-label="Checkbox for following text input">
</div>
<input type="text" class="form-control goals-txt" aria-label="Text input with checkbox">
</div>`);
     
   }
  // setInterval(update_user_data,1000*300);
   update_user_data();
   
})
function update_user_data()
{
 console.log("updated");
    let user_data={};
    let local_data=localStorage;
    for (var k of Object.keys(local_data))
    {
      if(/data_journal/.test(k)==true)
      { console.log(k);
          if(user_data.journal !=undefined)
          {
              user_data.journal.push(local_data[k]);
          }
          else
          {
              user_data['journal']=[];
              user_data.journal.push(local_data[k]);
          }
      }
      else
        {user_data[k]=local_data[k];
        }
    }
    console.log(user_data);
    fetch('update',{ method:'PUT',body:JSON.stringify(user_data)})
    .then((response)=>{console.log(response);})
    .then(()=>{console.log('Sended')});
   // .catch((err)=>{console.log(err);});
}
function nav_journal(date_nav,t_date)
{   let temp_date=t_date;
    let t=new Date();
    switch(date_nav)
    { 
        case 'prev':
                    curr_date.setDate(curr_date.getDate()-1);
                    //get content
                    get_content(curr_date); 
                    //make it disable
                    if(curr_date.getUTCDate()!=t.getUTCDate())
                    {document.getElementById('form-content-div').style="pointer-events:none";
                    console.log('block');
                    }else 
                    {
                        document.getElementById('form-content-div').style="pointer-events:auto";
                        console.log('allow');
                    }
                    break;
        case 'today'://get content
                    
                    curr_date=t;
                    get_content(curr_date)
                    //remove disable
                    document.getElementById('form-content-div').style="pointer-events:auto";
                    break;
        case 'next': 
                    curr_date.setDate(curr_date.getDate()+1)
                    get_content(curr_date);
                    if(curr_date.getUTCDate()!=t.getUTCDate())
                    {document.getElementById('form-content-div').style="pointer-events:none";
                    console.log('block');
                    }
                    else 
                    {
                        document.getElementById('form-content-div').style="pointer-events:auto";
                        console.log('allow');
                    }
                    break;
    }
    
}

function store_journal_data()
{   let prev_date=new Date();
    prev_date.setDate(prev_date.getDate()-1);
    let data_goals={'check':[],'goal':[]};
    for(let i=0;i<document.getElementsByClassName("form-data-goals").length;i++)
    {
        data_goals.check.push(document.getElementsByClassName("form-data-goals")[i].checked);
        data_goals.goal.push(document.getElementsByClassName('goals-txt')[i].value);
    }
    let data_goals_tmr=[];
    for(let i=0;i<document.getElementsByClassName("form-data-goal-tmr").length;i++)
    {
        data_goals_tmr.push(document.getElementsByClassName("form-data-goal-tmr")[i].value);
    }
    let curr_date=new Date();
    let data_comment=document.getElementsByClassName("form-data-comment")[0].value;
    let data_note_grateful=document.getElementsByClassName("form-data-grateful")[0].value;
    let data_note_tmr=document.getElementsByClassName("form-data-note-tmr")[0].value;
    
    let p_data=localStorage.getItem(`data_journal${prev_date.toLocaleDateString()}`);
    if(p_data!=null&&isjson(p_data)==true)
    {   p_data=JSON.parse(p_data);
    
            for(let i=0;i<p_data.goals_tmr.length;i++)
            {data_goals.check.push(false);
            data_goals.goal.push(p_data.goals_tmr[i]);
            }
    
    }
    let data={
            'date':curr_date.toLocaleDateString(),
            'goals':data_goals,
            'today_comment':data_comment,
            'grateful_today':data_note_grateful,
            'goals_tmr':data_goals_tmr,
            'note-tmr':data_note_tmr
    };
    if(localStorage.getItem(`data_journal${curr_date.toLocaleDateString()}`)!=undefined)
    {
        localStorage[`data_journal${curr_date.toLocaleDateString()}`]=JSON.stringify(data);
        console.log("okay");
    }
    else{
    localStorage.setItem(`data_journal${curr_date.toLocaleDateString()}`,JSON.stringify(data));
    console.log('new storage');
    } 
}
function get_content(date_of)
{
    let journal_date=new Date(date_of);
    let prev_date=new Date();
    prev_date.setDate(journal_date.getDate()-1);
    let d=localStorage.getItem(`data_journal${journal_date.toLocaleDateString()}`);
    let p_d=localStorage.getItem(`data_journal${prev_date.toLocaleDateString()}`);
    console.log(p_d);
    document.getElementById('date_div').innerText=journal_date.toLocaleDateString();
    let parent_div=document.getElementById('goals-div');
    parent_div.innerHTML='';
    let n_goals=0;
      
if(d!=null&&isjson(d)==true)
    {d=JSON.parse(d);
    console.log(d['goals']['check']);
        
    for(let i=0;i<d['goals']['check'].length;i++)
    { 
         parent_div.insertAdjacentHTML('beforeend',`
    <div class="input-group mb-3">
        <div class="input-group-text">
            <input class="form-check-input mt-0 form-data-goals" type="checkbox" id="c${i+1}"name="c${i+1}" value="c${i+1}" aria-label="Checkbox for following text input">
        </div>
            <input type="text" class="form-control goals-txt" aria-label="Text input with checkbox">
    </div>`)
        document.getElementsByClassName("form-data-goals")[i].checked=d['goals'].check[i];
        document.getElementsByClassName('goals-txt')[i].value=d['goals'].goal[i];
    n_goals=i;
    }

    for(let i=0;i<document.getElementsByClassName("form-data-goal-tmr").length;i++)
    {   document.getElementsByClassName("form-data-goal-tmr")[i].value="";
        document.getElementsByClassName("form-data-goal-tmr")[i].value=d['goals_tmr'][i];

    }
    document.getElementsByClassName("form-data-comment")[0].value="";
    document.getElementsByClassName("form-data-comment")[0].value=d['today_comment'];
    document.getElementsByClassName("form-data-grateful")[0].value="";
    document.getElementsByClassName("form-data-grateful")[0].value=d['grateful_today'];
    document.getElementsByClassName("form-data-note-tmr")[0].value="";
    document.getElementsByClassName("form-data-note-tmr")[0].value=d['note-tmr'];
   
    
      
}
    else
    {
        for(let i=0;i<document.getElementsByClassName("form-data-goals").length;i++)
        {
            
            document.getElementsByClassName("form-data-goals")[i].checked=false;
        }
        for(let i=0;i<document.getElementsByClassName("form-data-goal-tmr").length;i++)
        {
            document.getElementsByClassName("form-data-goal-tmr")[i].value="";
        }
        document.getElementsByClassName("form-data-comment")[0].value="";
        document.getElementsByClassName("form-data-grateful")[0].value="";
        document.getElementsByClassName("form-data-note-tmr")[0].value=""; 
        document.getElementById('prev-note').innerText='No Notes form previous day';
    }
    if(p_d!=null&&isjson(p_d)==true)
    { p_d=JSON.parse(p_d);
        console.log(p_d);
        if(p_d['note-tmr']!='')
        {
            
        document.getElementById('prev-note').innerText=p_d['note-tmr'];
        }
     
    for(let i=n_goals;i<p_d['goals_tmr'].length+n_goals;i++)
    {   console.log(p_d['goals_tmr'][i-n_goals-1]);
        parent_div.insertAdjacentHTML('beforeend',`
        <div class="input-group mb-3">
            <div class="input-group-text">
                <input class="form-check-input mt-0 form-data-goals" type="checkbox" id="c${i+1}"name="c${i+1}" value="c${i+1}" aria-label="Checkbox for following text input">
            </div>
                <input type="text" class="form-control goals-txt" aria-label="Text input with checkbox">
        </div>`)
            document.getElementsByClassName("form-data-goals")[i].checked=false;
            document.getElementsByClassName('goals-txt')[i].value=p_d['goals_tmr'][i-n_goals];
    }
}
}
function notes_starup()
{ console.log('notes_starup');
    if(typeof(Storage)!=undefined)
    {
        let notes=localStorage.getItem('notes');
        if(notes!=null)
        {   let edit_parent=document.getElementById('editor-parent');
            edit_parent.innerHTML='';
            notes=JSON.parse(notes);
            edit_parent.innerHTML=`<div class="row row-cols-1 row-cols-md-auto g-4" id="card-div"></div>`;
            let temp_div=document.getElementById("card-div");
            for(let i=0;i<notes.length;i++)
            { 
                
                temp_div.innerHTML+=
                
                `<div class="col">
                <div class="card border-success mb-3" style="max-width: 18rem;" onclick="open_doc(${i})" id="doc${i}" onmouseover="hover_doc(this)" onmouseout="dehover_doc(this)" >
  <div class="card-header bg-transparent border-success"><a>${notes[i].head}</a></div>
  <div class="card-body text-success">
    <p class="card-text">${notes[i].doc.ops[0].insert.substring(0,notes[i].doc.ops[0].insert.indexOf('\n'))}</p>
  </div>
</div>   </div>`
              ;
            }

            edit_parent.innerHTML+=`<button type="button" class="btn btn-primary" onclick='open_doc(${-2})'>Add new</button>`;
        } 
        else
        { let edit_parent=document.getElementById('editor-parent');
            edit_parent.innerHTML='';
            notes=[];
            localStorage.setItem('notes',JSON.stringify(notes));
            edit_parent.innerHTML+=`<span><button type="button" class="btn btn-primary" onclick='open_doc(${-1})'>Add new</button></span>`
        }
        
    }
    else
    {
        console.log('no storage');
    }
}
function hover_doc(doc_id)
{
    
    doc_id.classList.add('hover');
    
}
function dehover_doc(doc_id)
{
  
    doc_id.classList.remove('hover');
}
function open_doc(doc_num)
{
    if(doc_num<0)
    {       if(doc_num==-1)
            {
             document.getElementById('editor-parent').innerHTML=`
             <div class="d-flex flex-row justify-content-between">
            <input type="text" id="head" value="Title"><button type="button" id="save_btn" class="btn btn-primary">Save</button></div><div id="editor"></div>
             `;
            var quill= new Quill('#editor',{
            theme:'snow'
            });
         document.getElementById('save_btn').onclick=()=>save_doc(quill.getContents(),0);
        }
        else if(doc_num==-2)
        {
        if(localStorage.getItem('notes')=='')
        {
            document.getElementById('editor-parent').innerHTML=`
            <div class="d-flex flex-row justify-content-between">
            <input type="text" id="head" value="Title"><button type="button" id="save_btn" class="btn btn-primary">Save</button></div><div id="editor"></div>`;
        var quill= new Quill('#editor',{
            theme:'snow'
            });
            document.getElementById('save_btn').onclick=()=>save_doc(quill.getContents(),0);
        }
        else
        { let n=JSON.stringify(localStorage.getItem('notes')).length;
        document.getElementById('editor-parent').innerHTML=`
        <div class="d-flex flex-row justify-content-between">
            <input type="text" id="head" value="Title"><button type="button" id="save_btn" class="btn btn-primary">Save</button></div>
        <div id="editor"></div>`;
        var quill= new Quill('#editor',{
            theme:'snow'
            });
            document.getElementById('save_btn').onclick=()=>save_doc(quill.getContents(),n);
        }
        
        }
    
        
    }
    else
    {
        let notes = JSON.parse(localStorage.getItem('notes'))[doc_num];
        console.log(notes.doc.ops);
        document.getElementById('editor-parent').innerHTML=`<div class="d-flex flex-row justify-content-between">
        <input type="text" id="head" value="Title"><button type="button" id="save_btn" class="btn btn-primary">Save</button></div>
        <div id="editor"></div>`;

            var quill= new Quill('#editor',{
            theme:'snow'
            });
        document.getElementById('head').value=notes.head;
        quill.setContents(notes.doc.ops);
        document.getElementById('save_btn').onclick=()=>save_doc(quill.getContents(),doc_num);
    }
    
}
function save_doc(quill_var,doc_num)
{
    let notes=localStorage.getItem('notes');
     
    if(notes=='')
    {
        notes={'id':0,'doc':'','head':document.getElementById('head').value};
        let arr=[];
        notes.doc=quill_var;
        arr.push(notes);
        localStorage.notes=JSON.stringify(arr);

    }
    else if(doc_num<JSON.parse(notes).length)
    {
        if(notes=='')
        {
            notes={'id':0,'doc':'','head':document.getElementById('head').value};
        let arr=[];
        notes.doc=quill_var;
        arr.push(notes)
        localStorage.notes=JSON.stringify(arr);
        }
        else{
        notes=JSON.parse(notes)[doc_num];
        notes.head=document.getElementById('head').value;
        notes.doc=quill_var;
        let update=JSON.parse(localStorage.getItem('notes'));
        update[doc_num]=notes;
        localStorage.notes=JSON.stringify(update);
        }
    }
    else{
    
notes={'id':JSON.parse(notes).length,'doc':'','head':document.getElementById('head').value};
        notes.doc=quill_var;

            let update=JSON.parse(localStorage.getItem('notes'));
            update.push(notes);
            localStorage.notes=JSON.stringify(update);

    }
    let alert_parent_div=document.getElementById('editor-parent');
    alert_parent_div.insertAdjacentHTML('afterbegin',`<div class="alert alert-success alert-dismissible fade show" role="alert">
    Notes Saved Successfully
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`)
}


function submit_journal()
{
    let journal_data={
        'date':document.getElementById("date").value,
        'grateful_text':document.getElementById("grateful").value,
        'day_text':document.getElementById("journal").value,
        'today_goal':document.getElementById("today_goal").value,
        'goal_tmr':[document.getElementById("tmr-1").value,
                    document.getElementById("tmr-2").value,
                    document.getElementById("tmr-3").value,
                    document.getElementById("tmr-4").value,
                    document.getElementById("tmr-5").value
                    ]
    };
    document.getElementById("date").value=""
    document.getElementById("grateful").value="";
    document.getElementById("journal").value="";
    document.getElementById("today_goal").value="";
    document.getElementById("tmr-1").value="";
    document.getElementById("tmr-2").value="";
    document.getElementById("tmr-3").value="";
    document.getElementById("tmr-4").value="";
    document.getElementById("tmr-5").value="";
    console.log(journal_data);
}
function show_playlist(data_obj)
{ console.log(data_obj)
    data_obj=data_obj.data.episodes.data;
 main_playlist_div=document.getElementById("playlist");
 main_playlist_div.innerHTML="";
 console.log(main_playlist_div.innerHTML);
 for(let i=0;i<data_obj.length;i++)
 {
 main_playlist_div.innerHTML+=
 `
<div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-sm-4">
      <img src="${data_obj[i].imageUrl}" alt="..." width="100%">
    </div>
    <div class="col-md-6">
      <div class="card-body">
        <h5 class="card-title">${data_obj[i].title}</h5>
        <p class="card-text">${data_obj[i].description.slice(0,160)}..</p>
        <button class="btn btn-primary" onclick=' play_podcast(${JSON.stringify(data_obj[i])})'>Play</button>
      </div>
    </div>
  </div>
</div>`;
}
}
function play_podcast(podcast_elem)

{ //podcast_elem=JSON.parse(podcast_elem)
    console.log(podcast_elem.id);
    main_playlist_div=document.getElementById("playlist");
 main_playlist_div.innerHTML="";
if(typeof(Storage)!=undefined)
{
    let id=localStorage.getItem('history');
    
    if(id!=null)
    {
        console.log(id.split(','));
        id=id.split(',');
        id.push(podcast_elem.id);
        
        localStorage.history=id.toString();
    }
    else
    {
        localStorage.setItem('history','');
        id=[podcast_elem.id];
        localStorage.history=id.toString();
    }
}
else
{
    console.log('No storage');
}
 main_playlist_div.innerHTML=`
 <div class="card play_podcast" >
  <div class="d-flex justify-content-center" >
    <video  class=""controls="" _autoplay="" poster="${podcast_elem.imageUrl}" >
 <source  type="audio/mp3" src="${podcast_elem.audioUrl}">
 </video>
 </div>
  <div class="card-body">
    <h5 class="card-title">${podcast_elem.title}</h5>
    <p class="card-text">${podcast_elem.description}</p>
   
  </div>
</div>
 
`;// <a href="#" class="btn btn-primary">Go somewhere</a>
}
function isjson(str)
{
    try{
        JSON.parse(str);
    }
    catch(e)
    {
        return false;
    }
    return true;
}



function change_content(content)
{
    switch(content)
    {
        case 'journal':
                    toggle('form');
                    console.log('journal');
                 break;
        /*case 'forest':toggle('forest');
                        console.log('forest');
                    break;*/
        case 'notes':
                    toggle('notes');
                    notes_starup();
                    
                    console.log('notes');
                    break;
        case 'player':toggle('player');
        //document.getElementById('player').getElementsByTagName('audio')[0].volume=0.1;
                    console.log('player');
                    break;
        case 'list':toggle('task');
                    console.log('trello');
                    
                    list_setup();
                    
                    
                    
                    
                    break;
    }
}

function toggle(id)
{
    document.getElementById('form').style.display='none';
    document.getElementById('player').style.display='none';
    //document.getElementById('forest').style.display='none';
    document.getElementById('notes').style.display='none';
    document.getElementById('task').style.display='none';
    document.getElementById(id).style.display='block';
    let curr_date=new Date();
    if(id=="form")
    {document.getElementById('date_div').innerText=curr_date.toLocaleDateString();
    }
}
function clear_data()
{   console.log("working")
    for(let i=0;i<document.getElementsByClassName("form-data-goals").length;i++)
        {
            document.getElementsByClassName("form-data-goals")[i].checked=false;
        }
        for(let i=0;i<document.getElementsByClassName("form-data-goal-tmr").length;i++)
        {
            document.getElementsByClassName("form-data-goal-tmr")[i].value='';
        }
        document.getElementsByClassName("form-data-comment")[0].value='';
        document.getElementsByClassName("form-data-grateful")[0].value='';
        document.getElementsByClassName("form-data-note-tmr")[0].value='';
        store_journal_data();
}
function add_list(id)
{ 
    let list_ele=document.getElementById(id);
    list_ele.insertAdjacentHTML('afterend',`<div class="input-group input-group-sm" id="add-li-div" onfocusout="this.remove(); console.log('removing it');">
    
    <input type="text" class="form-control" >
    <button class="btn btn-secondary" onmousedown="add_list_li(${id},this.parentElement)">✔️</button>
    
  </div>`);
  console.log(id);

    document.getElementById('add-li-div').getElementsByTagName('input')[0].focus();

}
function add_list_li(id,text)
{ console.log(id);
 //let list_ele=document.getElementById(id);
 id.insertAdjacentHTML('beforeend',`<li class="list-group-item">${text.getElementsByTagName('input')[0].value}</li>`);  

}
function update_list(id)
{   let list_data=document.getElementById('lists');
    
    let list_li_data={'title':list_data.getElementsByTagName('h2')[0].innerText,'list':[]};
    for(var i=0;i<list_data.getElementsByClassName('list-ul').length;i++)
    { let temp_div=list_data.getElementsByClassName('list-ul')[i];
        list_li_data.list.push({'list_title':temp_div.getElementsByTagName('h4')[0].innerText,'list_text':[]});
        for(var j=0;j<temp_div.getElementsByTagName('li').length;j++)
        {
            list_li_data.list[i].list_text.push(temp_div.getElementsByTagName('li')[j].innerText);
        }
    }
    let list_content=[];
    console.log(list_content);
    if(id==0 && localStorage.list_data==undefined)
    {   list_li_data.id=0;
        list_content.push(list_li_data);
        //first
    }
    else if(localStorage.list_data!=undefined)
    {
        //it's new
        list_content=JSON.parse(localStorage.list_data);
        list_content[id]=list_li_data;
    }
    else 
    {
        list_content=JSON.parse(localStorage.list_data);
        list_li_data.id=list_content.length;
        list_content.push(list_li_data);
    }
    //list_content.push(list_li_data);
    localStorage.list_data=JSON.stringify(list_content);
    
}
function list_setup()
{
    document.getElementById('main-list').style.display="block";
    document.getElementById('pre-list').style.display="none";
    let index_list=localStorage.getItem('list_data');
    let div_list=document.getElementById('main-list-div');
        div_list.innerHTML='';
    if(index_list!=undefined)
    {
        index_list=JSON.parse(index_list);
        console.log(index_list);
        
        for(var i=0;i<index_list.length;i++)
        { div_list.insertAdjacentHTML("beforeend",`<div class="col">
        <div class="card text-white bg-primary mb-3" style="max-width: 7rem;" id="list_${i}" onclick="get_list_data(${i})" >
          <div class="card-body">
            <h6 class="card-title">${index_list[i].title}</h6>
          </div>
        </div>
      </div>`);
        }
    }
    document.getElementById('main-list-div').insertAdjacentHTML('beforeend',`
    <div class="col">
        <button class="btn btn-primary" type="button" onclick="add_new_list_group_title()">Add new list group</button>
    </div>
    `);
}
function add_new_list_group_title()
{
    
    let list_ele=document.getElementById('main-list-div');
    list_ele.insertAdjacentHTML('beforeend',`<div class=" col input-group input-group-sm" id="add-li-div" onfocusout="this.remove(); console.log('removing it');">
    
    <input type="text" class="form-control" >
    <button class="btn btn-secondary" onmousedown="add_list_group(this.parentElement)">✔️</button>
    
  </div>`);
  //console.log(id);
    document.getElementById('add-li-div').getElementsByTagName('input')[0].focus();
}
function add_list_group(title_element)
{   let c=-2;
    let num_list=0;
    if(localStorage.list_data==undefined)
    {   num_list=0;
        //update_list(-2);
        c=-1;
    }
    else
    {   num_list=JSON.parse(localStorage.list_data).length;
        c=-2;
    }
    console.log('working');
    document.getElementById('main-list').style.display="none";
    document.getElementById('pre-list').style.display="block";
    if(c==-2)
    document.getElementById('pre-list').innerHTML=`<div class="row l${num_list}" id="lists"></div>`;
    
    let li_div=document.getElementById('lists');
    li_div.innerHTML=''
    li_div.insertAdjacentHTML("afterbegin",` <h2>${title_element.getElementsByTagName('input')[0].value}</h2>`)
    document.getElementById('pre-list').insertAdjacentHTML("beforeend",`
    <div class="">
        <button class="btn btn-primary" type="Button" onclick="pre_new_list()">Add another list</button>
    </div>`);
    
    document.getElementById('lists').onmouseleave=()=>{update_list(num_list);};     

}
function get_list_data(id)
{ document.getElementById('main-list').style.display="none";
document.getElementById('pre-list').style.display="block";
document.getElementById('pre-list').innerHTML=`<div class="row" id="lists"></div>`;
    console.log(id);
    let list_data=localStorage.list_data;
    if(list_data!=undefined)
    {
        list_data=JSON.parse(list_data)[id];

    
    console.log(list_data);

    let li_div=document.getElementById('lists');
    li_div.innerHTML=''
    li_div.insertAdjacentHTML("afterbegin",` <h2 class="fs-3">${list_data.title}</h2>`)
   let txt_ids="";
   let count=1;
    for(var j=0;j<list_data.list.length;j++)
    {
        li_div.insertAdjacentHTML("beforeend",`
        <div class="col-2 list-ul">
            <h6 class="list-group-item">${list_data.list[j].list_title}</h6>
                <ul id="sortable${j+1}"class="connectedSortable list-group flex-shrink-1">
        </ul>
              <button type="button" class="btn btn-primary" onclick="add_list('sortable${j+1}')">Add more</button>
            </div>`);
            for(var i=0;i<list_data.list[j].list_text.length;i++)
        {
            document.getElementById(`sortable${j+1}`).insertAdjacentHTML("beforeend",`<li class=" list-group-item">${list_data.list[j].list_text[i]}</li>`);
        }
        txt_ids+=`#sortable${j+1},`;
        count++;
    }
    }
    document.getElementById('pre-list').insertAdjacentHTML("beforeend",`
    <div class="">
        <button class="btn btn-primary" type="Button" onclick="pre_new_list()">Add another list</button>
    </div>`);
    //li_div
    
    add_jquery();
      document.getElementById('lists').onmouseleave=()=>{update_list(id);};     
}
function pre_new_list()
{
    let list_ele=document.getElementById('lists');
    list_ele.insertAdjacentHTML('beforeend',`<div class=" col-2 list-ul input-group input-group-sm" id="add-li-div" onfocusout="this.remove(); console.log('removing it');">
    
    <input type="text" class="form-control" >
    <button class="btn btn-secondary" onmousedown="add_new_list(this.parentElement)">✔️</button>
    
  </div>`);
  //console.log(id);
    document.getElementById('add-li-div').getElementsByTagName('input')[0].focus();
}
function add_new_list(parent_elem)
{ let count=document.getElementsByClassName('list-ul').length+1;
    document.getElementById('lists').insertAdjacentHTML("beforeend",`<div class="col-2 list-ul">
    <h4 class="list-group-item">${parent_elem.getElementsByTagName('input')[0].value}</h4>
        <ul id="sortable${count}"class="connectedSortable list-group flex-shrink-1">
</ul>
      <button type="button" class="btn btn-primary" onclick="add_list('sortable${count}')">Add more</button>
    </div>`);
add_jquery();
}
function add_jquery()
{
    let t=document.getElementsByClassName('list-ul');
    let txt="";
    for(var i=0;i<t.length;i++)
    {
        txt+=`#sortable${i+1},`;
    }
    txt=txt.slice(0,-1);
    $(txt ).sortable({
        connectWith: ".connectedSortable"
      }).disableSelection();
}