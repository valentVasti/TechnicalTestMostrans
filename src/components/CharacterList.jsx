import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React from 'react'
import { FaAngleRight } from 'react-icons/fa6'

const CharacterList = ({ openDetailSection, data, isLoading }) => {
    const handleClick = (data) => {
        openDetailSection(data, 'character')
    }

    return (
        <Table aria-label="Example static collection table" selectionMode='single' hideHeader>
            <TableHeader>
                <TableColumn>CHARACTER</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading} loadingContent={<Spinner label="Loading..." />}>
                {
                    data.map((item) => (
                        <TableRow key={item.id} onClick={() => handleClick(item)}>
                            <TableCell className='flex justify-between items-center'>
                                <div className='flex justify-left gap-2 items-center'>
                                    <img src={item.image} alt={item.name} className="size-10 sm:size-12 rounded-full" />
                                    <div>
                                        <h2 className='font-semibold sm:text-lg'>{item.name}</h2>
                                        <h2 className='text-gray-500 text-xs sm:text-sm'>{item.status + ' - ' + item.gender}</h2>
                                    </div>
                                </div>
                                <FaAngleRight className='bg-gray-200 p-1 rounded-full' size={20} />
                            </TableCell>
                        </TableRow>)
                    )
                }
            </TableBody>
        </Table>

    )
}

export default CharacterList