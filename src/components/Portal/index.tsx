import { useEffect, useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export interface IPropsPortal {
  id: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const Portal: React.FC<IPropsPortal> = (props) => {
  const { id } = props;
  const [el, setEl] = useState<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const target = document.getElementById(id);
    target && setEl(target);
  }, [setEl, id]);

  return el && ReactDOM.createPortal(props.children, el);
};

export default Portal;
