import React from 'react';
import styled from 'styled-components';
import {useEffect,useRef} from 'react';

const Tooltip = ({children,title,message}) => {
  const tooltipRef = useRef(null);
  
  useEffect(()=>{
    const container = tooltipRef.current;
    const input = container.querySelector('input');
    const tooltip = container.querySelector('.tooltip');

    const handleKeyDown = (e:KeyboardEvent)=>{
      if(e.ctrlKey && (e.key === 'b' || e.key === 'i')){
        e.preventDefault();;
        tooltip.style.scale = '1';
     }

     setTimeout(()=>{
      tooltip.style.scale = '0';
     },2000);
    }

    input?.addEventListener('keydown',handleKeyDown);
    
  } , [])

  return (
    <StyledWrapper>
      <div className="tooltip-container" ref={tooltipRef}>
        <span className="tooltip">
          <p className="title">{title}</p>
          <p className="content">
            {message}
          </p>
        </span>
        {children}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Material Design 3 tooltip */
  .tooltip-container {
    position: relative; 
    transition: all 0.2s;
  }
  

  .tooltip {
    transform-origin: center left;
    scale: 0;
    position: absolute;
    top: -200%;
    left: 50%;
    transform: translate(-50%, -10px);
    transition: all 0.25s;
    background: #f3edf7;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15);
    padding: 17px;
    border-radius: 12px;
    color: #49454f;
    min-width: 312px;
  }

//   .tooltip-container .tooltip {
//     scale: 1;
//   }

  .tooltip .title {
    font-weight: bold;
    font-size: 1em;
  }

  .tooltip .content {
    font-size: 0.85em;
    font-weight: semibold;
  }`;

export default Tooltip;
