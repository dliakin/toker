import React, { useState, useEffect, forwardRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Container, LinearProgress, makeStyles } from '@material-ui/core'
import AdminApi from '../../axios/admin'
import { logout } from '../../redux/actions/userActions'
import MaterialTable from 'material-table'

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 20,
        marginBottom: 104
    },
}))




const Dashboard = ({ token }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [data, setData] = useState()

    useEffect(() => {

        async function fetchData() {
            try {
                const data = await AdminApi.dashboard(token)
                setData(data)
            } catch (error) {
                if (error.response.data.error && error.response.data.error.name === 'TokenExpiredError') {
                    dispatch(logout())
                }
            }
        }
        fetchData()
    }, [token, dispatch])

    if (data) {
        console.log(data)
        return (
            <Container className={classes.container}>
                <MaterialTable
                    icons={tableIcons}
                    title="Все пользователи"
                    columns={[
                        { title: 'id', field: 'id', type: 'numeric', filtering: false },
                        { title: 'Email', field: 'email', filtering: false },
                        {
                            title: 'Оплачено до',
                            field: 'paidTo',
                            customFilterAndSearch: (term, rowData) => {
                                if (term === 'оплата') {
                                    return rowData.paidTo !== 'заявка'
                                }
                                if (term === 'заявка') {
                                    return term === rowData.paidTo
                                }
                                return true
                            },
                            defaultFilter: 'оплата'
                        },
                        { title: 'Телефон', field: 'tel', filtering: false },
                        { title: 'Телеграм', field: 'telegramUser', filtering: false },
                        { title: 'UTM', field: 'utm', filtering: false },
                    ]}
                    data={data}
                    options={{
                        sorting: true,
                        filtering: true
                    }}
                    detailPanel={rowData => {
                        return (
                            <MaterialTable
                                icons={tableIcons}
                                title="Оплаты"
                                columns={[
                                    { title: 'id', field: 'id' },
                                    { title: 'Создана', field: 'createdAt' },
                                    { title: 'Оплачено до', field: 'paidTo' },
                                    { title: 'Сумма', field: 'realSum' }
                                ]}
                                data={rowData.pays}
                                options={{
                                    sorting: true,
                                    search: false,
                                    toolbar: false
                                }}
                            />
                        )
                    }}
                />
            </Container>
        )
    } else {
        return (
            <LinearProgress />
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.user.token,
    }
}

export default connect(mapStateToProps, null)(Dashboard)