import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layouts';
import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { SummaryTile } from '@/components/admin';
import { CircularProgress, Grid, Typography } from '@mui/material';
import useSWR from 'swr'
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>(`/api/admin/dashboard`, {
        refreshInterval: 30 * 1000
    })

    const [ refreshIn, setRefreshIn] = useState<number>(30)

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 )
        },1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    if (!error && !data) {
        return (
            <>
                <CircularProgress />
            </>
        )
    }

    if (error) {
        console.log(error, 'while getting data')
        return <Typography>Unable to get dashboard data</Typography>
    }

    const { 
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders,
    } = data!

    return (
        <>
            <AdminLayout
                title='Admin - dashboard'
                subtitle='Statistics about the page'
                icon={<DashboardOutlined />}
            >
                <Grid container spacing={2}>
                    <SummaryTile title={numberOfOrders} subtitle={'Total Orders'} icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />} />
                    <SummaryTile title={paidOrders} subtitle={'Paid orders'} icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />} />
                    <SummaryTile title={notPaidOrders} subtitle={'Pending Orders'} icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />} />
                    <SummaryTile title={numberOfClients} subtitle={'Clients'} icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />} />
                    <SummaryTile title={numberOfProducts} subtitle={'Products'} icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />} />
                    <SummaryTile title={productsWithNoInventory} subtitle={'Without existence'} icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />} />
                    <SummaryTile title={lowInventory} subtitle={'On existence'} icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />} />
                    <SummaryTile title={refreshIn} subtitle={'Update in:'} icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />} />

                </Grid>
            </AdminLayout>
        </>
    )
}

export default DashboardPage

/*

<Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3}>
                        <Card sx={{ display: 'flex'}} className="fadeIn">
                            <CardContent sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />
                            </CardContent>
                            <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column'}}>
                                <Typography variant='h3'>8</Typography>
                                <Typography variant='caption'>Total orders</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
*/