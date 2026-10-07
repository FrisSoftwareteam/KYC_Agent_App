declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string | ImageSourcePropType;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string | ImageSourcePropType;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}

// declare module '@bankify/redux-persist-realm/index' {
//   const content: any;
//   export default content;
// }
