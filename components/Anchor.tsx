type Props = {
  children: React.ReactNode;
};

export default function Anchor(props: Props, { ...restProps }) {
  return (
    <a href="/logout" {...restProps}>
      {props.children}
    </a>
  );
}
