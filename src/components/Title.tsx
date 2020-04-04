import React from "react";
import { Heading } from "rebass"

const Title = props => {
    return <Heading
        {...props}
        sx={{
            whiteSpace: 'pre-line',
            p: 2,
            color: 'text',
            textAlign:'center'
        }}
    />
}

export default Title; 