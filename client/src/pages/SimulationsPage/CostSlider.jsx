import { Box, Slider, Grid, Input, Typography } from "@mui/material";
import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { api } from "../../state/api";
import SimulationsChart from "./SimulationsChart";

function CostSlider() {
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(30);
    const [max, setMax] = React.useState(50)
    const [min, setMin] = React.useState(0)
    const [a, setA] = React.useState('')
    const [b, setB] = React.useState('')
    const [initial, setInitial] = React.useState(30);
    const [target, setTarget] = React.useState('');


    const logFunc = (cost) => {
        return (a*Math.log(cost) + b)
    }

    useEffect(()=>{
        const logFunction = (cost,a,b) => {
            return (a*Math.log(cost) + b)
        }
        const fetchFunction = async () => {
            const response = await dispatch(
                api.endpoints.getCostFunction.initiate()
            )

            const data = response.data.data
            const latest = Math.round(data.latest_cost)
            const range = data.slider_range
            setInitial(latest)
            setA(data.a)
            setB(data.b)
            setValue(latest)
            setMax(latest+range)
            setMin(latest-range)
            console.log(latest)
            setTarget(Math.round(logFunction(latest, data.a, data.b)))
            console.log(logFunc(latest))
            console.log(data)
        }
        fetchFunction()

    }, [dispatch])


    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleTargetChange = (event) => {
        setTarget(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < min) {
            setValue(min);
        } else if (value > max) {
            setValue(max);
        }
    };

    return (
        <Box>
            <Typography variant="h4" mb="1rem">Change in Operational Cost ($): {value-initial}</Typography>
            <Box>
                <Typography variant="h4" mb="0.2rem">Operational Cost ($): </Typography>
                <Input
                    value={value}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                        step: 100,
                        min: min,
                        max: max,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                    sx={{
                        color: '#d1d3da',
                        ':before': { borderBottomColor: '#d1d3da' },
                    }}
                />
            </Box>
            
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        step={100}
                        min={min}
                        max={max}
                    />
                </Grid>
                <Grid alignItems="center" item>
                    
                </Grid>
            </Grid>
            <SimulationsChart target={target} value={logFunc(value)}/>
            <Typography variant="h4" color="primary">Total Container Throughput</Typography>
            <Typography variant="h4">Container Throughput Target (1000s TEU): </Typography>
            <Input
                value={target}
                size="small"
                onChange={handleTargetChange}
                inputProps={{
                    step: 100,
                    min: 0,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                }}
                sx={{
                    color: '#d1d3da',
                    ':before': { borderBottomColor: '#d1d3da' },
                }}
            />
            <Typography variant="h4" mb="1rem" mt="1rem">Container Throughput (1000s TEU): {logFunc(value)}</Typography>
            <Typography variant="h4" mb="1rem" mt="1rem">To Target: {target-logFunc(value)}</Typography>
        </Box>
    )
}

export default CostSlider