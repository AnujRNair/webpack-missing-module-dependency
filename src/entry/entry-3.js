function importAndUseThings() {
  const promises = [
    import(/* webpackChunkName: "entry3-async" */ './entry-async-3')
  ];

  return Promise.all(promises).then(([funcs]) => {
    window.temp = funcs;
    return funcs;
  })
}

importAndUseThings();
