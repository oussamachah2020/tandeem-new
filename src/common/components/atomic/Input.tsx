import {ChangeEventHandler, HTMLInputTypeAttribute, ReactNode, RefObject, useMemo} from "react";
import * as Icons from "@heroicons/react/24/outline";
import {InformationCircleIcon} from "@heroicons/react/24/outline";
import {Tooltip} from "react-tooltip";
import {md5Hash, toHtmlDate} from "@/common/utils/functions";


interface Props<T> {
    icon?: keyof typeof Icons,
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>,
    placeholder?: string,
    _ref?: RefObject<any>,
    name?: keyof T,
    label?: string,
    type?: HTMLInputTypeAttribute | 'select' | 'textarea',
    accept?: 'image' | 'doc',
    disabled?: boolean,
    required?: boolean,
    min?: string | number | Date,
    max?: string | number | Date,
    initialValue?: string | number | boolean | Date | null,
    className?: string,
    tooltip?: string,
    children?: ReactNode,
    options?: Record<string, string>,
    selected?: string,
    readOnly?: true
}


export function Input<T>({
                             icon,
                             onChange,
                             _ref,
                             placeholder,
                             label,
                             name,
                             required,
                             type,
                             accept,
                             disabled,
                             min,
                             max,
                             initialValue,
                             className,
                             children,
                             tooltip,
                             options,
                             selected,
                             readOnly
                         }: Props<T>) {
    const randomId = useMemo(() => md5Hash(`${placeholder}${label}${initialValue}${className}`), [])
    const Icon = icon && Icons[icon]
    const inputClassName = `w-full px-3.5 py-2.5 pl-12 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition duration-200 disabled:bg-gray-50 ${readOnly && 'read-only:bg-gray-50 read-only:focus:ring-0 read-only:cursor-default'}`
    const fileClassName = 'relative w-full text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-secondary transition duration-200 file:py-2.5 file:px-3.5 file:mr-2 file:text-sm file:rounded-l-lg file:bg-gray-100 file:border-0 file:transition file:duration-200 file:hover:file:bg-gray-200 file:cursor-pointer'
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <div className="flex gap-2 items-center text-sm">
            {tooltip && (
              <>
                <InformationCircleIcon
                  className="text-secondary w-5 h-5"
                  data-tooltip-id="tooltip"
                />
                <Tooltip id="tooltip" content={tooltip} />
              </>
            )}
            <label htmlFor={randomId}>{label}</label>
            {(required != undefined ? required : true) && !disabled && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
        )}
        <div className={`w-full h-full ${type !== "file" && "relative"}`}>
          {type != "file" && Icon && (
            <div
              className={`absolute flex ${
                type === "textarea" ? "py-3" : "items-center"
              } inset-y-0 left-0 pl-4`}
            >
              <Icon
                className={`w-5 h-5 -mt-1.5 transition-colors duration-200 ${
                  disabled ? "text-gray-400" : "text-primary"
                }`}
              />
            </div>
          )}
          {type === "select" && (
            <select
              id={randomId}
              name={name as string}
              className={inputClassName}
              required={required != undefined ? required : true}
              disabled={disabled}
              onChange={onChange}
              ref={_ref}
            >
              <option value="" disabled selected={!selected}>
                {placeholder}
              </option>
              {options &&
                Object.entries(options).map(([key, value], idx) => (
                  <option key={idx} value={key} selected={key === selected}>
                    {value}
                  </option>
                ))}
            </select>
          )}
          {type === "checkbox" && (
            <div className="flex items-center gap-3 text-sm h-full">
              <input
                id={randomId}
                name={name as string}
                disabled={disabled}
                onChange={onChange}
                ref={_ref}
                type="checkbox"
                className="w-5 h-5"
                defaultChecked={initialValue as boolean | undefined}
              />
              {children}
            </div>
          )}
          {type === "textarea" && (
            <textarea
              id={randomId}
              name={(name as string) ?? ""}
              className={inputClassName.concat(" min-h-[4rem]")}
              placeholder={placeholder ?? ""}
              required={
                disabled != undefined
                  ? disabled
                  : required != undefined
                  ? required
                  : true
              }
              disabled={disabled}
              defaultValue={initialValue ? (initialValue as string) : undefined}
              maxLength={max as number}
            />
          )}
          {type !== "select" && type !== "textarea" && type !== "checkbox" && (
            <input
              id={randomId}
              name={name as string}
              type={type ?? "text"}
              pattern={type === "tel" ? "^\\+?\\d+$" : undefined}
              className={type === "file" ? fileClassName : inputClassName}
              placeholder={placeholder}
              readOnly={readOnly}
              accept={(() => {
                if (accept === "image") return "image/png,image/jpeg";
                if (accept === "doc")
                  return "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                return undefined;
              })()}
              required={required != undefined ? required : true}
              disabled={disabled}
              onChange={onChange}
              min={
                min ? (min instanceof Date ? toHtmlDate(min) : min) : undefined
              }
              max={
                max ? (max instanceof Date ? toHtmlDate(max) : max) : undefined
              }
              defaultValue={
                initialValue
                  ? initialValue instanceof Date
                    ? toHtmlDate(initialValue)
                    : (initialValue as string)
                  : undefined
              }
            />
          )}
        </div>
      </div>
    );
}
