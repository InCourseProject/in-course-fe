import React from 'react'
import { css, jsx } from '@emotion/react'
import styled from '@emotion/styled'
import HomeCard from './HomeCard'
import axios from 'axios'
import { useEffect, useState, useRef, useCallback } from 'react'
import { colors, fonts, fontWeight, lineHeights } from '../../../lib/constants/GlobalStyle'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../../hook/useFetch'
import Btn from '../../../components/Button'
import Loading from '../../Loading/Loading'
import Sunny from '../../../lib/constants/img/sunny.gif'
import Cloud from '../../../lib/constants/img/clouds.gif'
import Rain from '../../../lib/constants/img/rain.gif'
import Snow from '../../../lib/constants/img/snow.gif'
import Cloud_Sunny from '../../../lib/constants/img/clouds_sunny.gif'


const HomeComponent = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('Authorization');
    const refreshToken = localStorage.getItem('RefreshToken');
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState(null);
    const [weathers, setWeathers] = useState({});
    const [dresss, setDresss] = useState({});
    const [page, setPage] = useState(1);
    const row = useRef(null);
    const { formattedList = [] } = useFetch(page, `${process.env.REACT_APP_SERVER_API}/api/course`);

    //위치 좌표 가져오는 함수
    const geoLocactionButton = () => {
        if (navigator.geolocation) {
            setLoading(true)
            navigator.geolocation.getCurrentPosition((position) => {
                var lat = position.coords.latitude, // 위도
                    lon = position.coords.longitude; // 경도
                setWeather({ x: String(lon), y: String(lat) })

            });
        }
    }

    //비 회원 추천코스
    const notLogin = async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_API}/api/course/common/recommended`);
        setPost(response.data);
    }

    //회원 추천코스
    const common = async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_API}/api/course/member/recommended`, {
            headers: {
                Authorization: accessToken,
                RefreshToken: refreshToken
            }
        });
        setPost(response.data); //for realserver

    }

    //옷 추천 함수
    const dress = async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_API}/api/weather/recommend`, {
            headers: {
                Authorization: accessToken,
                RefreshToken: refreshToken
            }
        });
        setDresss(response.data)
    }

    //날씨 받아오는 함수
    const Weather = async () => {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_API}/api/weather/open`, weather, {
            headers: {
                Authorization: accessToken,
                RefreshToken: refreshToken
            }

        },
            setLoading(false));
        setWeathers(response.data);
        common();
        dress()
    }

    // 무한스크롤 동작 함수
    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev) => prev + 1);
        }
    }, []);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (row.current) observer.observe(row.current);
    }, [handleObserver]);

    useEffect(() => {
        if (accessToken === null) {

            notLogin()
        } else {

            geoLocactionButton()

        }
    }, []);
    useEffect(() => {
        if (weather === null) {
            return;
        } else {
            Weather()
        }
    }, [weather]);

    return (
        <StContainer>
            {loading ? <Loading /> : null}
            {!accessToken

                ? <StNotlogin>
                    <span>지금 로그인하시고 <br />오늘 날씨에 딱 맞는 코스를 추천 받으세요!</span>
                    <Btn
                        size='sm'
                        variant='main'
                        style={{ fontWeight: `${fontWeight.bold}` }}
                        onClick={() => navigate('/login')}
                    >
                        로그인 하기
                    </Btn>
                </StNotlogin>
                : <div>
                    <StWeatherContainer>
                        <StWeatherWrap>
                            <StWetherImg>
                                <img
                                    src={weathers.weather === "맑음" ? Sunny :
                                        weathers.weather === "흐림" ? Cloud :
                                        weathers.weather === "비" ? Rain :
                                        weathers.weather === "눈" ? Snow :
                                        weathers.weather === "조금흐림" ?
                                        Cloud_Sunny : null} alt="" />

                            </StWetherImg>
                            <TitH1 >오늘의  날씨는 <br /> <span>{weathers.weather}</span>  입니다.</TitH1>
                            <StWeatherBox>
                                <StDetailBox >
                                    <p style={{marginLeft: '0.3rem', color:`${colors.gray}`, fontWeight: `${fontWeight.bold}`}}>Temp</p>
                                    <StWetherTemp>
                                        <p>{weathers.temp}℃</p>
                                    </StWetherTemp>
                                </StDetailBox>
                                <StDetailBox >
                                    <p style={{marginLeft: '0.3rem', color:`${colors.gray}`, fontWeight: `${fontWeight.bold}`}}>Detail</p>
                                    <StWetherDetail>
                                        <div>
                                            <p>계절:<span>{weathers.season}</span> </p>
                                            <p>습도:<span>{weathers.humidity}</span></p>
                                            <p>풍속:<span>{weathers.wind_speed}</span></p>
                                        </div>
                                        <div>
                                            <p>구름양:<span>{weathers.clouds}</span></p>
                                            <p>강수량/h:<span>{weathers.rain_h}</span></p>
                                            <p>강우량/h:<span>{weathers.snow_h}</span></p>
                                        </div>
                                    </StWetherDetail>
                                </StDetailBox>
                            </StWeatherBox>
                        </StWeatherWrap>
                        <StDivWrap>
                            <ul>
                                <li>오늘은 {dresss.pants}, {dresss.top}  어때요?</li>
                                <li>{dresss.supplies2} 챙겨가시면 좋아요!</li>
                            </ul>
                            <div>
                                <Btn
                                    size='default'
                                    variant='main'
                                    style={{marginBottom: '10rem'}}
                                    onClick={() => { localStorage.getItem("Authorization") === null ? alert('로그인 후 이용해주세요') : navigate('/category') }}
                                > 하루의 코스 만들러 가기
                                </Btn>
                            </div>
                        </StDivWrap>
                    </StWeatherContainer>

                </div>
            }


            

            <StHomeCardWrap >
                <h1>추천코스</h1>
                {post === null ? <StDiv> 아직 추천해 줄 게시물이 없어요!</StDiv> : <HomeCard key={post?.id} post={post} />}

                <h1>전체코스</h1>
                {formattedList.map((post) =>
                    <HomeCard
                        key={post.id}
                        post={post}
                    />
                )}
                <div ref={row}></div>
            </StHomeCardWrap >
        </StContainer>
    )
}

export default HomeComponent

const StWeatherContainer = styled.div`
    position: relative;
    text-align: center;
    
    
`
const StWeatherWrap = styled.div`
    font-size: ${fonts.subTitle};
    object-fit:cover;
    img{
        width: 200px;
        height: 200px;
    }
    p{
        font-size: ${fonts.headLine};
        color: ${colors.deepGray};
    }
`
const StWeatherBox = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-around;
   text-align: left;
   padding: 10px;
   gap: 10px;
   
   div{font-size:${fonts.body}}
   p{font-size: ${fonts.body};}
`
const StDiv = styled.div`
    font-size: ${fonts.body};
`
const StWetherTemp = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid ${colors.lightGray};
    border-radius: 10px;
    text-align: center;
    padding: 20px 10px;
    p{font-size: 3em;}
    
`
const StWetherImg = styled.div`
    width: 100%;
    height: 100%;
    padding: 30px;
    margin-top: 5rem;
`
const StWetherDetail = styled.div`
    width: 100%;
    border: 1px solid ${colors.lightGray};
    border-radius: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 10px;
    p{
        font-size: ${fonts.body};
    }
    span{
        font-size: ${fonts.body};
        margin-left: 0.5rem;
    }
    
`
const StDetailBox = styled.div`
    width: 100%;
`
const StContainer = styled.div`
    width: 100%;
    /* display: flex;
    justify-content: center;
    flex-direction: column; */
`

const StNotlogin = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    span{
        max-width: 32rem;
        margin-top: 10rem;
        color: ${colors.deepGray};
        font-size: ${fonts.body};
        line-height: ${lineHeights.subTitle};
        font-weight: ${fontWeight.bold};
    }
    button{
        margin-top: 3rem;
        margin-bottom: 10rem;
    }
`

const TitH1 = styled.h1`
    width: 100%;
    text-align: center;
    font-size: ${fonts.subTitle};
    color: ${colors.primary};
    padding: 15px;
    span{
        font-size: ${fonts.subTitle};
        color: ${colors.secondary};
    }
`
const StDivWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 10px;
    div{
        width: 100%;
        text-align: center;
    }
    ul{
        width: 100%;
    }
    li{
        width: 100%;
        padding: 15px 30px;
        border-radius: 15px;
        border: 1px solid ${colors.lightGray};
        font-size: ${fonts.subTitle};
        font-weight: ${fontWeight.normal};
        color: ${colors.deepGray};
        margin-bottom: 10px;
    }
`
const StHomeCardWrap = styled.div`
max-width:768px;
margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    h1{
        font-size:  ${fonts.headLine};
        color: ${colors.deepGray};
        margin-top: 40px;
    }
`