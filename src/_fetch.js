//参考  https://review.udacity.com/?utm_campaign=ret_000_auto_ndxxx_submission-reviewed&utm_source=blueshift&utm_medium=email&utm_content=reviewsapp-submission-reviewed&bsft_clkid=8b2d3e7c-7817-4567-af79-16bb6d552fa7&bsft_uid=751e6253-cf8e-4cab-99d6-745fe435450b&bsft_mid=e12943bd-2e75-4599-8210-192b90dc20b4&bsft_eid=6f154690-7543-4582-9be7-e397af208dbd&bsft_txnid=4c117bd9-069f-45fd-80f5-bb9ccb1b6153#!/reviews/1713272
//由于原生的 fetch API 不支持设置超时 timeout，可以考虑封装一个可检测请求超时的 _fecth
export function _fetch(fetch_promise, timeout) {
      var abort_fn = null;

      //这是一个可以被reject的promise
      var abort_promise = new Promise(function(resolve, reject) {
             abort_fn = function() {
                reject('abort promise');
             };
      });

      //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
       var abortable_promise = Promise.race([
             fetch_promise,
             abort_promise
       ]);

       setTimeout(function() {
             abort_fn();
        }, timeout);

       return abortable_promise;
}