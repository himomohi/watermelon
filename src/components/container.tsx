import React from 'react';

const container = (props) => {
    return <div className="flex justify-center items-center bg-slate-400">{props.children}</div>;
};

export default container;
