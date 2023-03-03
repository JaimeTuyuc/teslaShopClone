import React, { useEffect, useState } from 'react'

import { PeopleOutline } from '@mui/icons-material';
import { CircularProgress, Grid, MenuItem, Select } from '@mui/material';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IUser, IRole } from '@/interfaces';
import axios from 'axios';
import { tesloApi } from '@/api';

const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>(`/api/admin/users`)
    const [ users, setUsers] = useState<IUser[]>([])
    //console.log(data, 'que es data')

    useEffect(() => {
        if (data) {
            setUsers(data)
        }
    },[data])

    if (!data && !error) {
        return (
            <CircularProgress />
        )
    }

    const onRoleUpdate = async (userId: string, role: IRole) => {
        const previousUsers = users.map( (user) => ({ ...user }))
        const updatedData = users.map((user) => ({
            ...user,
            role: userId === user._id ? role : user.role
        }))

        setUsers(updatedData)
        try {
            await tesloApi.put(`/admin/users`, {userId: userId, role: role })
        } catch (error) {
            setUsers(previousUsers)
            console.log(error, 'unable to update the user role')
            if (axios.isAxiosError(error)) {
                console.log('Not saved check console logs xD')
            }
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'User Name', width: 300 },
        {
            field: 'role',
            headerName: 'User Role',
            width: 300,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label="Role"
                        sx={{ width: '300px' }}
                        onChange={(e) => onRoleUpdate(row.id, e.target.value )}
                    >
                        <MenuItem value="admin" disabled={row.role === 'admin'}>Admin</MenuItem>
                        <MenuItem value="client" disabled={row.role === 'client'}>Client</MenuItem>
                    </Select>
                )
            }
        }
    ]

    const rows = users.map((user) => ({ 
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))

    return (
        <AdminLayout
            title='Users Page'
            subtitle='Manage all users and update them'
            icon={<PeopleOutline />}
        >

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={ columns }
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default UsersPage
