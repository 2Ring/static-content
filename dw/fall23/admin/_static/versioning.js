window.addEventListener('load', function () {
    getVersions();
});

function getVersions() {
  if (window.location.protocol === 'file:') {
    let buildRootIndex = window.location.href.lastIndexOf('/build/');
    let buildRootUrl = window.location.href.substring(0, buildRootIndex + 7);
    getVersionsJson(buildRootUrl + 'versions.json');
  } else {
    let splitHref = window.location.href.split('/');
    let docsIndex = splitHref.indexOf('docs');
    let rootUrl = splitHref.slice(0, docsIndex + 2).join('/');

    let url;
    if (rootUrl.endsWith('/')) {
      url = rootUrl + 'versions.json';
    } else {
      url = rootUrl + '/versions.json';
    }

    getVersionsJson(url);
  }
}

function getVersionsJson(url) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      let versions = JSON.parse(xhr.responseText);
      displayVersionDropdown(versions);
    } else {
      console.warn('Failed to load the versions file. Version dropdown will not be displayed.');
    }
  }
  xhr.open('GET', url);
  xhr.overrideMimeType("application/json");
  xhr.send();
}

function displayVersionDropdown(versions) {
  let currentVersion = getCurrentVersion(versions);

  if (currentVersion !== null) {
    let dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('version-container');

    let label = document.createElement('label');
    label.innerText = 'Version:';
    label.classList.add('version-label');
    dropdownContainer.appendChild(label);

    let dropdown = document.createElement('select');
    dropdown.classList.add('version-dropdown');
    for (let i in versions) {
      let version = versions[i];
      let option = document.createElement('option');
      option.value = version;
      option.innerText = version;
      if (version === currentVersion) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    }
    dropdown.addEventListener('change', function () {
      let selectedVersion = dropdown.value;
      window.location.href = window.location.href.replace('/' + currentVersion + '/', '/' + selectedVersion + '/');
    });
    dropdownContainer.appendChild(dropdown);

    document.querySelector('.sphinxsidebar').appendChild(dropdownContainer);
  }
}

function getCurrentVersion(versions) {
  for (let i in versions) {
    let version = versions[i];
    if (window.location.pathname.indexOf('/' + version + '/') !== -1) {
      return version;
    }
  }

  return null;
}
