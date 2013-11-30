(function () {

  var hash = location.hash.replace('#', '');

  var isHashNewToken = /token\/[0-9a-z]+/.test(hash);
  if (isHashNewToken) {
    localStorage.setItem('token', hash.replace('/token/', ''));
    location.hash = '#';
  }

  var token = localStorage.getItem('token');
  if (!token || !/^[0-9a-z]+$/.test(token)) {
    location.href = '/auth/github';
    return;
  }

})();
