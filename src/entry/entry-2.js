function importAndUseThings() {
  const promises = [
    import(/* webpackChunkName: "entry2-async" */ './entry-async-2')
  ];

  return Promise.all(promises).then(([funcs]) => {
    window.temp = funcs;
    return funcs;
  })
}

importAndUseThings();
