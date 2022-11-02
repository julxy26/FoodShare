type Props = {
  children: React.ReactNode;
};

export default function Anchor(props: Props, { ...restProps }) {
  return <a {...restProps}>{props.children}</a>;
}
