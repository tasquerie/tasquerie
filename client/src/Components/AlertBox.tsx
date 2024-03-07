import React, { Component } from 'react';

interface AlertBoxProps {
    close(): void;
    title: string;
    message: string;
}

export class AlertBox extends Component<AlertBoxProps> {
    constructor(props: AlertBoxProps) {
        super(props);
        // no state for now
    }

    render() {
        return(
            <div id="alertBox">
                <div className="alertTitle">{this.props.title}</div>
                <div className='alertMessage'>{this.props.message}</div>
                <button onClick={() => this.props.close()}>Close</button>
            </div>
        )
    }
}