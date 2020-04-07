import React from "react";
import { Button } from "rebass"

const MenuButton = props => {
    return <Button
        {...props}
        sx={{
            border:'3px solid white',
            backgroundColor:'transparent',
            p: 3,
            m:1,
            color: 'text',
            textAlign:'center',
            fontWeight:'800',
            textTransform:'uppercase',
            '&:hover': {
                backgroundColor:'text',
                color: 'black',
              }
        }}
    />
}

export default MenuButton; 