import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../redux/modules/common';

const defaultTitle = {
  success: 'Success',
  info: 'Info',
  warn: 'Warning',
  error: 'Error',
  normal: 'Info',
};

const Toast = ({ toast, dismiss }) => (
  <div className={`toast toast--${toast.type}`}>
    <div className="toast__message">
      <span className="toast__title">
        {toast.title || defaultTitle[toast.type]}
        <div className="toast__actions">
          <button className="btn btn-link" onClick={dismiss}>
            <i className="fa fa-fw fa-times" />
          </button>
        </div>
      </span>
      {toast.msg}
    </div>

  </div>
);

const Toasts = ({ toasts, dismiss }) => (
  <div className="toasts">
    {toasts.map(n => <Toast key={n.id} toast={n} dismiss={dismiss(n.id)} />)}
  </div>
);

const mapStateToProps = state => ({
  toasts: state.common.notifications,
});

const mapDispatchToProps = {
  removeNotification: actions.removeNotification,
};

export const ToastsContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    dismiss: ({ removeNotification }) => id => () => removeNotification(id),
  }),
)(Toasts);