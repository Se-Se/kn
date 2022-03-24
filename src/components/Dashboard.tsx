import styled from '@emotion/styled/macro'
import React from 'react'

const Style = styled.div`
--spanWidth: 18px;
--trackWidth: 18px;
--marginWidth: 10px;
.min {
  text-align: right;
}
.min , .max {
  flex: none;
  display: inline-block;
  width: var(--spanWidth);
  color: #000;
  margin: 0 var(--marginWidth);
}
.title {
  text-align: center;
  font-size: 22px;
}
.dashboard {
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
}
.arc-wrapper {
  display: inline-block;
  position: relative;
  margin: 0 auto;
  /* width: calc(100% - var(--spanWidth) * 2); */
  width: 100%;
  padding-top: calc(50% - var(--spanWidth) - var(--marginWidth) * 2);
  height: var(--arcRadius);
  overflow: hidden;
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .children {
    color: #000;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    font-size: 20px;
  }
}
.track-arc {
  width: 100%;
  padding-top: calc(100% - 2 * var(--trackWidth));
  /* height: var(--rectWidth); */
  box-sizing: border-box;
  border-radius: 50%;
  border: var(--trackWidth) solid #ddd;
}
.round-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-origin: 50% 100%;
  z-index: 20;
  &:after {
    content: " ";
    position: absolute;

    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
.round {
  width: 100%;
  height: 200%;
  box-sizing: border-box;
  border-radius: 50%;
  border: var(--trackWidth) solid green;
}
`

export type DashBoardProps = {
  // from min to max, default is 0 - 100
  value: number
  // default to 0
  min?: number
  // default to 100
  max?: number
  // title
  title?: React.ReactNode
  // color, default to #fe4d55
  color?: string
}

export const Dashboard: React.FC<DashBoardProps> = ({ value, min = 0, max = 100, title, color = '#fe4d55', children }) => {
  const deg = 180 - (value - min) / (max - min) * 180
  const trans = { transform: `rotate(-${deg}deg)` }
  return <Style style={{ color }}>
    <div className='title'>{title}</div>
    <div className='dashboard'>
      <span className='min'>{min}</span>
      <div className='arc-wrapper'>
        <div className='wrapper'>
          <p className='track-arc'></p>
          <div className='round-box' style={trans}>
            <p className='round' style={{ borderColor: color }}></p>
          </div>
          <p className='children'>{children}</p>
        </div>
      </div>
      <span className='max'>{max}</span>
    </div>
  </Style>
}
