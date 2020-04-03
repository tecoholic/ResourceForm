import React from 'react';

function ThankYou(props) {
  return (
    <div>
      <article className="message is-success">
        <div className="message-body">
          <strong>Thank you!</strong> Your request has been taken. Someone will
          get in touch with you to co-ordinate the logistics.
        </div>
      </article>
    </div>
  );
}

export default ThankYou;