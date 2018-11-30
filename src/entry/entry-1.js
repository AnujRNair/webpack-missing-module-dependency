function importAndUseThings() {
  const promises = [
    import(/* webpackChunkName: "entry1-async" */ './entry-async-1')
  ];

  return Promise.all(promises).then(([mod]) => {
    const pre = document.createElement('pre');
    pre.innerText = JSON.stringify(mod.funcs, null, 2);
    document.body.appendChild(pre);

    return funcs;
  })
}

importAndUseThings();
