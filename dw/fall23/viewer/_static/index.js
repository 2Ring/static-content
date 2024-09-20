window.addEventListener('load', function () {
  querySelectToArray(document.querySelectorAll('.sphinxsidebarwrapper > ul a')).forEach(function (element) {
    let guideName = element.getAttribute('href').split('/')[0];
    element.parentElement.addEventListener('mouseenter', function () {
      let data = splashData[guideName];
      setSplash(
        image,
        bg_color,
        data.name,
        subtitle,
        data.description
      );
      querySelectToArray(document.querySelectorAll('.sphinxsidebarwrapper > ul a')).forEach(function (doc) {
        doc.parentNode.classList.remove('active');
      });
      element.parentElement.classList.add('active');
    });
  });
});

let background = {
  _i: 0,
  _backgroundElements: {
    0: document.getElementById('splash0'),
    1: document.getElementById('splash1')
  },
  get current() {
    return this._backgroundElements[this._i];
  },
  get next() {
    return this._backgroundElements[this._i ^ 1];
  },
  switch: function () {
    this._i ^= 1;
  }
}

let gadgets_version = '5.1.0';
let subtitle = 'for 2Ring Gadgets ' + gadgets_version;
let bg_color = '#68BECF';

let splashData = {
  installation: {
    name: 'Installation Guide',
    description: 'The 2Ring Gadgets installation guide covers the installation of all components provided by 2Ring.'
  },
  configuration: {
    name: 'Configuration Guide',
    description: 'To get most out of the 2Ring Gadgets, it is necessary to configure integration scenarios, workflows and other settings.'
  },
  connectors: {
    name: 'Connector Deployment Guides',
    description: 'Integrate all the tools that the agents use such as Salesforce, MS Dynamics CRM, SAP, ServiceNow, and other web-based systems.'
  },
  user: {
    name: 'User Guide',
    description: 'Integrate all the tools that the agents use (such as CRM and other web-based systems), automate repetitive tasks, connect agents to back office and remote experts, and much more.'
  },
  configuration_reference: {
    name: 'Configuration Reference',
    description: 'Contains the reference documentation for all Gadgets configuration files.'
  },
  workflow: {
    name: 'Workflow API Reference',
    description: 'Contains the reference documentation for the powerful Gadgets workflow API.'
  }
}

function setSplash(bg, color, title, subtitle, description) {
  background.current.style.opacity = 0;
  // Not needed until multiple images are used
  // background.next.style.backgroundImage = 'url(images/splashScreen/' + bg + ')';
  // background.next.style.backgroundColor = color;
  background.next.style.opacity = 1;
  background.next.querySelector('.contentTitle').innerText = title;
  background.next.querySelector('.contentSubtitle').innerText = subtitle;
  background.next.querySelector('.contentDescription').innerText = description;

  background.switch();
}
