import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setOtp } from '../store/otpSlice';

function useWebOtp() {
  const dispatch = useDispatch();

  const receive = useCallback(async () => {
    console.log(`'customElements' in window: ${'customElements' in window}`);
    console.log(`'OTPCredential' in window: ${'OTPCredential' in window}`);
    if ('customElements' in window && 'OTPCredential' in window) {
      try {
        const content = await window.navigator.credentials.get({
          // @ts-ignore
          otp: { transport: ['sms'] },
        });
        console.log(content.code);
        dispatch(setOtp(content.code));
      } catch (e) {
        console.error(e);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    receive();
  }, [receive]);
}

export default useWebOtp;
