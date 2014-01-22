describe('Ionic ActionSheet Service', function() {
  var sheet, timeout;

  beforeEach(module('ionic.service.actionSheet'));

  beforeEach(inject(function($ionicActionSheet, $timeout) {
    sheet = $ionicActionSheet;
    timeout = $timeout;
  }));

  it('Should show', function() {
    var s = sheet.show();
    expect(s.el.classList.contains('active')).toBe(true);
  });

  it('Should handle hardware back button', function() {
    // Fake cordova
    window.device = {};
    var s = sheet.show();

    timeout.flush();

    ionic.trigger('backbutton', {
      target: document
    });

    expect(s.el.classList.contains('active')).toBe(false);
  });
});
