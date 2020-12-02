document
.getElementById("btn-collapse")
.addEventListener("click", toggleToolbar);

document
.querySelectorAll('.flow-panel-open').forEach(element => {
  element.addEventListener('click', openFlowPanel);   
})

document
.querySelectorAll('.flow-panel-close').forEach(element => {
  element.addEventListener('click', closeFlowPanels);   
})


function toggleToolbar(event) {
  let emnts = document.getElementsByClassName("collapsable");
  let collapse = true; 

  for (i = 0; i < emnts.length; i++) {
    let c = emnts[i];
    if (c.style.display === "") {
      c.style.display = "none";
      collapse = true;
    } else {
      c.style.display = "";
      collapse = false;
    }
  }

  if (collapse) {
    collapseActionBar();
  
  } else {
    expandActionBar()
  }
  storeActionBarCollapse(collapse);    
}

function collapseActionBar() {
  document.getElementById("icon-collapse").classList.remove("icon-ui-expand");
  document.getElementById("icon-collapse").classList.add("icon-ui-collapse");
  document.getElementById("action-bar").style.flex = "0 0 3em";
}

function expandActionBar() {
  document.getElementById("icon-collapse").classList.remove("icon-ui-collapse");
  document.getElementById("icon-collapse").classList.add("icon-ui-expand");
  document.getElementById("action-bar").style.flex = "0 0 150px";
}

function storeActionBarCollapse(collapse) {
  let storage = window.sessionStorage;
  storage.setItem('actionBarState', collapse);
}

function getActionBarCollapse() {
  let storage = window.sessionStorage;
  return storage.getItem('actionBarState');
}

function setActionBarStatus() {
  let status = getActionBarCollapse();
  if (status === "true") {
    toggleToolbar();
  }
}

function closeFlowPanels(event) {
  document
  .querySelectorAll('.flow-panel').forEach(e => {
    e.style.display = 'none';   
  });

  document
  .querySelectorAll('.flow-panel-open').forEach(e => {
    e.className = e.className.replace(' active', '');   
  });  
}

function openFlowPanel(event) {
  if(event.currentTarget.className.includes('active')) {
    closeFlowPanels();
  } else {
    closeFlowPanels();
    let panelId = event.currentTarget.id;
    panelId = 'panel' + panelId.substr(panelId.lastIndexOf('-'));
    let panel = document.getElementById(panelId);
    panel.style.display = 'flex';
  
    document.getElementById(event.currentTarget.id).className += ' active';
  }
}