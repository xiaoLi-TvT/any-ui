import React, { useRef } from "react";
import classNames from "classnames";
import warning from "../_util/warning";

export type ButtonSize = "lg" | "sm";
export type ButtonType = "primary" | "default" | "danger" | "link";
export type ButtonShape = "default" | "circle" | "round";

interface BaseButtonProps {
  className: string; // 接受用户自定义类名
  disabled: boolean; // 是否开启禁用
  size: ButtonSize; // 控制组件大小
  children: React.ReactNode; // 可以选择直接传入内容，但label的优先级更高
  href: string; // 链接时地址
  padding: string; // 内外边距
  textColor: string; // 字体颜色
  label: string; // 按钮内部内容
}

type NativeButtonProps = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLElement>;

type AnchorButtonProps = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLElement>;

type fileterPartialType<T, U> = {
  [K in keyof T as K extends U ? never : K]?: T[K] | undefined;
};

export type ButtonProps = fileterPartialType<
  NativeButtonProps & AnchorButtonProps,
  "type"
> & {
  type?: ButtonType;
};

const Button: React.FC<ButtonProps> = (props) => {
  const {
    disabled,
    label,
    size,
    children,
    className,
    href,
    type,
    color,
    textColor,
    ...restProps
  } = props;

  const classes = classNames("ai-btn", className, {
    [`ai-btn-${type}`]: type, // type 参数存在时则动态添加 `ai-btn-${btnType}` 类
    [`ai-btn-${size}`]: size, // size 参数存在时动态添加 `ai-btn-${size}` 类 , size 包括大小padding ; font-size ; border-radius;
    disabled: type === "link" && disabled, // 由于 a 链接原生不带有 disabled 属性，因此需要手动给它添加一个 disabled 类。通过编写类的样式实现disabled效果
  });

  const coverStyle = {
    "background-color": color,
    color: textColor,
  };

  if (type && (color || textColor)) {
    warning(false, Button.toString(), "\n使用自定义样式请取消 type 属性");
  }

  if (type === "link" && href) {
    return (
      <a {...restProps} href={href} className={classes}>
        {label ? label : children}
      </a>
    );
  } else {
    return (
      <button
        {...restProps}
        className={classes}
        style={type ? {} : coverStyle}
        disabled={disabled}
      >
        {label ? label : children}
      </button>
    );
  }
};

Button.defaultProps = {
  disabled: false,
  type: "default",
};

export default Button;
