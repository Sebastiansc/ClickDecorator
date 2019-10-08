import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// import { usePrevious } from "../../hooks/index.js";

import "./click-decorator.css"


const mouseDownHandler = (isActive, { setActive, setCoordinates, setMouseUp }) => {
  const onMouseDown = e => {
    e.stopPropagation();
    setActive(true);
    setCoordinates({ x: e.clientX, y: e.clientY });

    // Animation already in progress, wrap up and fire new animation
    if (isActive) {
      setMouseUp(false);
      setActive(false);
      setActive(true);
    }
  }

  document.addEventListener("mousedown", onMouseDown);

  return () => {
    document.removeEventListener("mousedown", onMouseDown);
  }
}

const mouseUpHandler = (isActive, { setMouseUp, setActive }, ref) => {
  const onMouseUp = e => {
    e.stopPropagation();
    // We have to check if isActive so we don't attach event listener before ref is created
    if (isActive) {
      // Wait for exit animation to finish before we kill component;
      ref.current.addEventListener('animationend', () => {
        setMouseUp(false)
        setActive(false)
      });
    }

    setMouseUp(true);
  }

  document.addEventListener("mouseup", onMouseUp);

  return () => {
    document.removeEventListener("mouseup", onMouseUp);
  }
}

const mouseMoveHandler = (isActive, { setCoordinates }) => {
  const onMouseMove = e => {
    if (isActive) {
      e.stopPropagation();
      e.preventDefault();
      setCoordinates({ x: e.clientX, y: e.clientY });
    }
  }
    
  document.addEventListener("mousemove", onMouseMove);

  return () => {
    document.removeEventListener("mousemove", onMouseMove);
  }
}


const DecoratorCircle = () => {
  const [{ x, y }, setCoordinates] = useState({});
  const [isActive, setActive] = useState(false);
  const [isMouseUp, setMouseUp] = useState(false);
  const ref = useRef()
  const setters = { setActive, setCoordinates, setMouseUp };

  useEffect(() => mouseDownHandler(isActive, setters), [isActive]);
  useEffect(() => mouseUpHandler(isActive, setters, ref), [isActive]);
  useEffect(() => mouseMoveHandler(isActive, setters), [isActive]);  

  return isActive ? (
    <div
      ref={ref}
      className={`DecoratorCircle ${isMouseUp ? "DecoratorCircle--out" : ""}`}
      style={{ left: `${x}px`, top: `${y}px` }}
    /> 
  ) : null;
};

const ClickDecorator = () => {
  return createPortal(<DecoratorCircle/>, document.body);
};

export default ClickDecorator;