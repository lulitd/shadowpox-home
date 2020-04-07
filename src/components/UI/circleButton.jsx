import React from "react";
import { Button } from "rebass"

const CircleButton = props => {
    return (
        <Button
            {...props}
            sx={{
                border: '4px solid currentColor',
                backgroundColor: 'transparent',
                p: 0,
                m: [1, 2, 2],
                color: 'white',
                textAlign: 'center',
                borderRadius: '50%',
                fontSize: [6, 7],
                '&:hover': {
                    background: 'white',
                    color: 'black',
                    borderColor: 'white'
                },
            }}
            width={['80px', '100px']}
            height={['80px', '100px']}
        />);
}

export default CircleButton; 