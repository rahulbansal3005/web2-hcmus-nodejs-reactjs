import React, {useState, useEffect} from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import NearMe from '@material-ui/icons/NearMe'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

const styles = theme => ({
    root: {
        flexGrow: 1,
        display: "flex",
        flexWrap: "wrap",
        boxSizing: "border-box",
        margin: "16px 0",
        width: '100%',
        backgroundColor: '#f8fafc'
    },
    control: {
        padding: theme.spacing.unit * 3
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid #DFE3E8",
        borderRadius: 4,
        boxShadow: "none",
        color: "#12161B",
        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        backgroundColor: "#FFFFFF",
        margin: '5px 0px',
        padding: "10px 15px"
    },
    container: {
        display: 'block',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        display: "flex",
        margin: 16
    },
    bigAvatar: {
        width: 128,
        height: 128,
        backgroundColor: "#9c9c9c"
    },
    rightInformation: {
        flexGrow: 0,
        flexShrink: 0,
        marginLeft: 'auto'
    },
    leftInformation: {
        lineHeight: "7vh"
    },
    information: {
        listStyleType: 'none',
        display: 'flex',
        margin: "5px 0px",
        padding: 0
    },
    infoHead: {
        display: 'flex',

        "& > *": {
            paddingRight: '10px'
        },
        "&:nth-child(1)": {
            marginTop: "5px"
        }
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '5px 0px'
    },
    cardContent: {
        flexGrow: 1,
    },
    cardHeaderLeft: {
        textAlign: 'left'
    },
    helper: {
        color: 'red',
        fontSize: '12px',
        margin: "15px",
        marginTop: "-10px"
    },
})

const User = (props) => {
    const {actions, classes} = props;
    const [submitted, setSubmit] = useState(false);
    const [values, setValues] = useState({
        email: '', 
        fullname: '',
        phone: '',
        password: '',
        repassword: ''
    });
    const [onChangeValues, setOnChangeValues] = useState({
        email: false, 
        fullname: false, 
        phone: false, 
        password: false, 
        repassword: false, 
    });
    const [messageFrom, setMessageFrom] = useState({
        email: "Email không được để trống", 
        fullname: "Họ tên không được để trống", 
        phone: "Số điện thoại không được để trống", 
        password: "Mật khẩu không được để trống", 
        repassword: "Nhập lại mật khẩu !", 
    });

    useEffect(() => {
        if (submitted) {
            if (actions.User.payload.status === 200) {
                actions.history.push('/user')
            } else {
                actions.history.push('/')
            }
        }
    })

    const handleChange = (e) => {
        const {value, name} = e.target;
        setValues((values) => ({...values, [name]: value}));
        setOnChangeValues((values) => ({...values, [name]: true}));
        setSubmit(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Need fill some input
        if (!values.email || !values.fullname || !values.phone || !values.password || !values.repassword) {
            setOnChangeValues({
                email: true, 
                fullname: true, 
                phone: true, 
                password: true, 
                repassword: true
            });
            setMessageFrom({
                email: "Email không được để trống",
                fullname: "Họ tên không được để trống",
                phone: "Số điện thoại không được để trống", 
                password: "Mật khẩu không được để trống", 
                repassword: "Nhập lại mật khẩu !", 
            });
            return false;
        }

        // Valid password and repassword
        if (values.password !== values.repassword) {
            setValues({
                ...values,
                repassword: ''
            })
            setMessageFrom({
                ...messageFrom,
                repassword: "Nhập lại mật khẩu không chính xác"
            });
            return false;
        }

        // Email is incorrect format
        if (!/[a-z0-9._+-]+@[a-z0-9]{2,5}(\.[a-z0-9]{2,4}){1,2}/i.test(values.email)) {
            setValues({
                ...values,
                email: ''
            })
            setMessageFrom({
                ...messageFrom,
                email: "Email không đúng định dạng"
            });
            return false;
        }

        // Data is valid, dispatch to action
        setSubmit(true);
        actions.ChangeInfoUser(values)
    }

    const createCard = (info) => {
        return (
            <Card className={classes.card} key={info}>
               <CardHeader
                    avatar={
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                        A{info}
                        </Avatar>
                    }
                    title="Rạp: Lotte Q7"
                    subheader="Cụm Sài Gòn"
                    className={classes.cardHeaderLeft}
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Tên phim
                    </Typography>
                </CardContent>
                <CardActions>
                    <Typography>
                        1/1/2019 00:00
                    </Typography>
                </CardActions>
            </Card>
        )
    }

    const loadHistory = () => {
        return [1,2,3,4,5].map((data) => createCard(data))
    }

    return (
        <Grid container className={classes.root} spacing={16}>
            <Grid item xs={12} md={6} lg={4} xl={4}>
                <Paper className={classes.paper}>
                    <ul className={classes.information}>
                        <li className={classes.leftInformation}>
                            <Typography component="h3" variant="headline" align="left">
                                Phan Anh Viet
                            </Typography>
                            <Divider/>
                            <Typography component="h6" variant="subtitle1" gutterBottom align="left">
                                + admin@example.com
                            </Typography>
                            <Typography component="h6" variant="subtitle1" gutterBottom align="left">
                                + 84 333 666 999
                            </Typography>
                        </li>
                        <li className={classes.rightInformation}>        
                            <Avatar alt="Icon" src="/avatar.jpg" className={classes.bigAvatar} />
                        </li>
                    </ul>
                </Paper>
                <Paper className={classes.paper}>
                    <div className={classes.infoHead}>
                        <Typography component="h4" variant="headline" gutterBottom align="left" className={classes.social}>
                            Hồ sơ
                        </Typography>
                        <Typography  variant="subtitle2" align="right">
                            Chỉnh sửa thông tin cá nhân
                        </Typography>
                    </div>
                    <Divider />
                    <form className={classes.container}>
                        <TextField
                            required
                            id="outlined-email-input"
                            label="Email"
                            className={classes.textField}
                            type="email"
                            name="email"
                            autoComplete="email"
                            margin="normal"
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange}
                            />
                            {onChangeValues.email && !values.email &&
                                <Typography 
                                    variant="caption" 
                                    gutterBottom 
                                    align="left"
                                    className={classes.helper}>{messageFrom.email}
                                </Typography>
                            }
                        <TextField
                            required
                            id="outlined-fullname-input"
                            label="Họ tên"
                            className={classes.textField}
                            type="text"
                            name="fullname"
                            margin="normal"
                            variant="outlined"
                            value={values.fullname}
                            onChange={handleChange}
                            />
                            {onChangeValues.fullname && !values.fullname &&
                                <Typography 
                                    variant="caption" 
                                    gutterBottom 
                                    align="left"
                                    className={classes.helper}>{messageFrom.fullname}
                                </Typography>
                            }
                        <TextField
                            required
                            id="outlined-phone-input"
                            label="Số điện thoại"
                            className={classes.textField}
                            type="text"
                            name="phone"
                            margin="normal"
                            variant="outlined"
                            value={values.phone}                            
                            onChange={handleChange}
                            />
                            {onChangeValues.phone && !values.phone &&
                                <Typography 
                                    variant="caption" 
                                    gutterBottom 
                                    align="left"
                                    className={classes.helper}>{messageFrom.phone}
                                </Typography>
                            }
                        <TextField
                            required
                            id="outlined-password-input"
                            label="Mật khẩu"
                            className={classes.textField}
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            margin="normal"
                            variant="outlined"
                            value={values.password}                            
                            onChange={handleChange}
                            />
                            {onChangeValues.password && !values.password &&
                                <Typography 
                                    variant="caption" 
                                    gutterBottom 
                                    align="left"
                                    className={classes.helper}>{messageFrom.password}
                                </Typography>
                            }
                        <TextField
                            required
                            id="outlined-repassword-input"
                            label="Mật khẩu *nhập lại"
                            className={classes.textField}
                            type="password"
                            name="repassword"
                            margin="normal"
                            variant="outlined"
                            value={values.repassword}
                            onChange={handleChange}
                            />
                            {onChangeValues.repassword && !values.repassword &&
                                <Typography 
                                    variant="caption" 
                                    gutterBottom 
                                    align="left"
                                    className={classes.helper}>{messageFrom.repassword}
                                </Typography>
                            }
                        <Button 
                            variant="contained" 
                            color="inherit" 
                            className={classNames(classes.button, classes.signinButton)}
                            onClick={handleSubmit}
                            >
                            Thay đổi
                            <NearMe className={classes.rightIcon} />
                        </Button>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={8} xl={8}>
                <Paper className={classes.paper}>
                    <div className={classes.infoHead}>
                        <Typography component="h4" variant="headline" gutterBottom align="left" className={classes.social}>
                            Lịch sử
                        </Typography>
                        <Typography  variant="subtitle2" align="right">
                            Xem danh sách đã đặt
                        </Typography>
                    </div>
                    <Divider />
                    {loadHistory()}
                </Paper>
            </Grid>
        </Grid>        
    );
}

User.propTypes = {
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
}

export default withStyles(styles)(User)