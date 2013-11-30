(function () {

  var hash = location.hash.replace('#', '');

  var isHashNewToken = /[0-9a-z]+/.test(hash);
  if (isHashNewToken) {
    localStorage.setItem('token', hash);
    location.hash = '#';
  }

  var token = localStorage.getItem('token');
  if (!token) {
    location.href = '/auth/github';
    return;
  }

})();
