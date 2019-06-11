import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Navbar from './head/Navbar'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'

const styles = theme => ({
	root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 5,
    textAlign: 'center',
	},
	textField: {
    marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 100
	},
	fab: {
		marginTop: theme.spacing.unit * 2,
  },
  screen: {
    padding: 20,
    backgroundColor: '#f5f6f7',
    width: '320px',
    margin: '0 auto',
    marginBottom: 20,
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  chair_info: {
    display: 'inline-flex',
    textTransform: 'uppercase',
    padding: 20,
    margin: '0 auto',


    "& > *": {
      border: '1px dotted #ccc',
      fontWeight: 600,
      padding: 20,
      minWidth: '240px',
    }
  }
})

let rowTitle = ['1','2','3','4','5','6','7','8','9','10',
'11','12','13','14','15','16','17','18','19','20'];

let columnTitle = ['A','B','C','D','E','F','G','H','I','J',
'K','L','M','N','O','P','Q','R','S','T','U','V', 'W','X','Y','Z'];  

function getSteps() {
  return ['Chọn số lượng ghế', 'Vị trí ghế ngồi', 'Xác nhận thanh toán'];
}

function isBooked(x, y, dataChairsBooked) {
  for (let i = 0; i < dataChairsBooked.length; i++) {
    if (dataChairsBooked[i][0] === x && dataChairsBooked[i][1] === y) {
      return true;
    } 
  }
  return false;
}


function GetStyleChair(x, y, dataChairsBooked, dataUserChairs) {
  if (isBooked(x, y, dataChairsBooked)) {
    return "#ccc"
  } 

  if (isBooked(x, y, dataUserChairs)) {
    return "green"
  }

  else {
    return "#fff"
  }
}

function GeneralChairsMap(props) {
  const { row, column } = props
  const [dataChairsBooked, setDataChairsBooked] = useState([
    [0, 0],
    [2, 1],
    [1, 3]
  ]);
  const [dataUserChairs, setDataUserChairs] = useState([]);

  useEffect(() => {
    console.log('updated: ', dataUserChairs)
  }, [dataUserChairs])


  const Cell = (props) => {
    const { x, y } = props;
    
    let bg = "";
    if (isBooked(x, y, dataChairsBooked)) {
      bg = '#ccc'
    } else {
      bg = '#fff'
    }

    return (
      <Button
        style={{
          backgroundColor: GetStyleChair(x, y, dataChairsBooked, dataUserChairs),
          border: '1px solid',
          margin: "0px 1px 3px 1px",
          cursor: 'pointer',
        }}
        onClick={() => {
          if (isBooked(x, y, dataChairsBooked) || isBooked(x, y, dataUserChairs)) {
            return false;
          } else {
            let userBooked = [
              ...dataUserChairs,
              [x, y]
            ]
            setDataUserChairs(userBooked.slice(-3))

            console.log(x, " ", y);
          }
        }}
      >{columnTitle[x] + "" + rowTitle[y]}</Button>
    )
  }

  const Matrix = () => {
    let matrix = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        if (j === column / 2) {
          matrix.push(<span key={rowTitle[j]+i+j}> </span>)
        } 

        matrix.push(<Cell 
          key={columnTitle[i]+rowTitle[j]} 
          x={i} 
          y={j} 
        />)
      }
      matrix.push(<br key={columnTitle[i]}/>)
    }
    return matrix;
  }

  return (<Matrix />)
}

function getStepContent(stepIndex, classes) {

  let localState = JSON.parse(localStorage.getItem('localState'))

  const handleChangeNumberChair = (e) => {
    const { value } = e.target
    let update = {
      ...localState,
      number_chair: value || 0
    }
    localStorage.setItem('localState', JSON.stringify(update))
  }

  switch (stepIndex) {
    case 0:
      return (
				<React.Fragment>
					
					<TextField
						id="filled-bare"
						className={classes.textField}
						defaultValue="1"
						margin="normal"
						variant="filled"
						type="number"
            inputProps={{ min: "1", max: "10", step: "1" }}
            onChange={handleChangeNumberChair}
					/>
				</React.Fragment>
			)
    case 1:

        if (!localState) {
          return (
            <p>Không khớp dữ liệu</p>
          )
        } else {
          return (
            <React.Fragment>
              <Typography className={classes.screen}>Màn hình</Typography>
              <GeneralChairsMap 
                row={localState.number_row} 
                column={localState.number_column} 
              />
              <section className={classes.chair_info}>
                <Typography>Số ghế: {localState.number_chair}</Typography>
                <Typography>Đã chọn: ABC</Typography>
              </section>
            </React.Fragment>
          )
        }
    case 2:
      return 'Xem lại quá trình đặt vé';
    default:
      return 'Ủa lỗi gì vậy :(';
  }
}

const Ticket = (props) => {
	const { classes, actions } = props
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

	// navigation
	useEffect(() => {

		let localState = localStorage.getItem('localState')
		localState = JSON.parse(localState);

		if (!localState || !localState.user_id) {
			actions.history.push('/auth/login');
		}
		
	}, []);


	// steper controller
  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);

    // send ticket data to server for next
    if (activeStep === steps.length - 1) {
      console.log('sended !')
    }
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleReset() {
    setActiveStep(0);
  }

	
	return (
		<React.Fragment>
			<Navbar />
			<div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>Hoàn tất quá trình đặt vé</Typography>
            <Button onClick={handleReset}>Đặt thêm vé mới</Button>
          </div>
        ) : (
          <div>
            <section className={classes.instructions}>{getStepContent(activeStep, classes)}</section>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Quay lại
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp theo'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
			</React.Fragment>
	)
}

Ticket.propTypes = {
	classes: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
}

export default withStyles(styles)(Ticket)

