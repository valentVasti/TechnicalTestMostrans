import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React from 'react'
import { FaAngleRight } from 'react-icons/fa6'

const CharacterByLocation = ({ openDetailSection, data }) => {
    const handleOnclick = (data) => {
        openDetailSection(data, 'location')
    }

    return (
        <Table aria-label="Example static collection table" selectionMode='single' fullWidth hideHeader>
            <TableHeader>
                <TableColumn>LOCATION NAME</TableColumn>
            </TableHeader>
            <TableBody emptyContent='There is no location data'>
                {
                    data !== null ?
                        data.map((item) => (
                            <TableRow key={item.id} onClick={() => handleOnclick(item)}>
                                <TableCell className='flex justify-between items-center'>
                                    <div className='flex justify-left gap-2 items-center'>
                                        <div>
                                            <h2 className='font-semibold sm:text-lg'>{item.name}</h2>
                                        </div>
                                    </div>
                                    <FaAngleRight className='bg-gray-200 p-1 rounded-full' size={20} />
                                </TableCell>
                            </TableRow>)
                        ) : null
                }
            </TableBody>
        </Table>
    )
}

export default CharacterByLocation