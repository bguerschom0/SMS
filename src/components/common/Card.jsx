import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon,
  headerAction,
  footer,
  className = '',
  noPadding = false,
  ...rest
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
      {...rest}
    >
      {/* Card Header - Only render if title, subtitle, or headerAction exists */}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {icon && <div className="mr-3">{icon}</div>}
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      
      {/* Card Body */}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
