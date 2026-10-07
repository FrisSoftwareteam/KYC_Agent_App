import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

export default function BadgeLogo({color}: {color: string}) {
  return (
    <Svg width="17" height="22" viewBox="0 0 17 22" fill="none">
      <Path
        d="M15.5626 3.91667L8.61905 1L1.67552 3.91667C1.67552 3.91667 0.1556 10.3827 1.67552 14.0208C3.16022 17.5747 8.61905 21 8.61905 21C8.61905 21 14.0779 17.5747 15.5626 14.0208C17.0825 10.3827 15.5626 3.91667 15.5626 3.91667Z"
        stroke={color}
      />
      <Circle cx="8.61884" cy="10.5239" r="4.2619" stroke={color} />
      <Path
        d="M10.4263 9.3585L7.98665 11.3173L7.24518 10.1914"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
