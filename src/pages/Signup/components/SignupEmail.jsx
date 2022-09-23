import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from '@emotion/styled';
import { colors } from '../../../lib/constants/GlobalStyle';

const SignupEmail = () => {
  const navigate = useNavigate();
  //----------- input handler -----------//
  const initialstate = {
    email: '',
    password: '',
    passwordConfirm: ''
  }
  const [ signup, setSignup] = useState(initialstate);
  
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setSignup({ ...signup, [name]:value });
  };

  console.log(signup)
  //----------- input handler -----------//
  // 이메일로 본인 인증
  // 비밀번호 양식 대소문자숫자포함 8~20자
  // axios.post('/api/member/signup')

  const signupInputHandler = async () => {
    try{
      const res = await axios.post('http://3.36.71.186:8080/api/member/signup',
      signup);

      if((res.state === 200 || 201)){
        // send signup data
        console.log('newSignupUseEmail>> ', res);
        window.alert('회원가입이 완료되었습니다.');
        navigate('/login');

        //모달창으로 이메일 본인인증 해야함.
      }else{
        console.error('notOk', res);
      };
    }
    catch(error){
      console.error(error)
      setSignup(initialstate);
      window.alert('❌CHECKCONSOLE❌');
    };
  };

  useEffect(() => {

  },[]);

  return(
    <div>
        <StForm onSubmit={signupInputHandler}>
          <StDiv>서비스 배너</StDiv>
          <input 
            onChange={onChangeHandler} 
            placeholder='email' 
            name='email' 
            value={signup.email} 
            type='email' 
          />
          <input 
            onChange={onChangeHandler} 
            placeholder='password' 
            name='password' 
            value={signup.password} 
            minLength='8' 
            maxLength='20' 
            type='password' 
          />
          <input 
            onChange={onChangeHandler} 
            placeholder='passwordcheck' 
            name='passwordConfirm' 
            value={signup.passwordConfirm} 
            type='password' 
          />
          <button type='submit'>회원가입</button>  
        </StForm>
    </div>
  );
}

export default SignupEmail;

const StForm = styled.form`
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  `

  const StDiv = styled.div`
    width: 100%;
    position: relative;
    background-color: ${colors.primary};
    margin-bottom: 30px;
    ::after{
      content: '';
      display: block;
      padding-bottom: 30%;
    }
  `