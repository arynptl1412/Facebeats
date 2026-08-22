import React from 'react';
import FacialExpressions from '../components/FacialExpressions';

const FacialExpression = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Expression and Mood Detection</h1>
            <FacialExpressions />
        </div>
    );
};

export default FacialExpression;