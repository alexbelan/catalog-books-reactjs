import React from 'react';

export default function RenderImg(props) {
    if (props.img === "") {
        return (<>
          <div className="img not-preview">{props.title}</div>
        </>)
    } else {
        return (<>
            <img className="img" src={props.img} />
        </>)
    }
}