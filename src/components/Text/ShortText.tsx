import React from "react";
import { Text } from "rebass"

const ShortText = props => {
    return <Text
        {...props}
        sx={{
            whiteSpace: 'pre-line',
            p: 2,
            color: 'text',
            textAlign:'center',
            fontFamily:'heading'
        }}
    />
}

export default ShortText; 