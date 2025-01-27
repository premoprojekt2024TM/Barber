import React from 'react';
import BubbleUI from 'react-bubble-ui';
import 'react-bubble-ui/dist/index.css';
import Child from './ChildComponent'; 
import './bubble.css.css';

interface MyComponentProps {
  data: any[]; 
}

export const BubbleGrid: React.FC<MyComponentProps> = (props) => {
  const options = {
    size: 180,
    minSize: 20,
    gutter: 8,
    provideProps: true,
    numCols: 6,
    fringeWidth: 160,
    yRadius: 130,
    xRadius: 220,
    cornerRadius: 50,
    showGuides: false,
    compact: true,
    gravitation: 5,
  };

  const children = props.data.map((data, i) => (
    <Child data={data} className="child" key={i} />
  ));

  return (
    <BubbleUI options={options} className="myBubbleUI">
      {children}
    </BubbleUI>
  );
};

export default BubbleGrid;
