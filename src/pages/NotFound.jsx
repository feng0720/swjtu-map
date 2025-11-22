import React from 'react';
import './NotFound.css';
import { useNavigate } from 'react-router-dom';
import {ArrowRight} from 'lucide-react';

const Loader = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen overflow-hidden flex justify-center items-center bg-gradient-to-b from-slate-900 via-slate-800 to-sky-900 text-white">
      <div className="w-full h-full">
        <div className="box-of-star1">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div className="box-of-star2">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div className="box-of-star3">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div className="box-of-star4">
          <div className="star star-position1" />
          <div className="star star-position2" />
          <div className="star star-position3" />
          <div className="star star-position4" />
          <div className="star star-position5" />
          <div className="star star-position6" />
          <div className="star star-position7" />
        </div>
        <div data-js="astro" className="astronaut">
          <div className="head" />
          <div className="arm arm-left" />
          <div className="arm arm-right" />
          <div className="body">
            <div className="panel" />
          </div>
          <div className="leg leg-left" />
          <div className="leg leg-right" />
          <div className="schoolbag" />
        </div>
      </div>
      <div className='absolute top-[10%] font-black text-3xl font-mono'>网页随着宇航员飞到<span className='text-blue-400 mr-2 ml-2'>银河系</span>了找不到了</div>
      <div className='absolute top-[18%] flex justify-center items-center gap-5 z-10'>点击旁边的按钮回到你来的地方吧孩子<ArrowRight className='w-5 h-5'></ArrowRight>
      <button className='bg-blue-400 text-black font-black border-2 rounded-xl p-1 transition-all hover:scale-125' onClick={()=>navigate('/')}>按钮</button>
      </div>
    </div>
  );
}

export default Loader;
