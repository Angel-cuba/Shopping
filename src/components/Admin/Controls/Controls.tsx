import React from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import GetAppIcon from '@mui/icons-material/GetApp'
import './Controls.scss'
import { Input } from '../../Input/Input'

type SearchProps = {
  search: string
  setSearch: (value: string) => void
}

export const Controls = ({ search, setSearch }: SearchProps): JSX.Element => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div className="controls">
      <Input
        type="text"
        name="search by name"
        onChange={handleSearch}
        placeholder="Searching"
        value={search}
        style={{
          width: '160px',
          height: '30px',
          fontSize: '18px',
          color: 'black',
          margin: '0 10px',
          padding: '0 10px',
          borderRadius: '5px',
          border: '1px solid #d3d3d3'
        }}
      />
      <div className="controls__panel">
        <Filter />
        <Create />
        <Export />
      </div>
    </div>
  )
}

const Filter = () => {
  return (
    <div className="controls__panel__button">
      <FilterListIcon />
      <p className="controls__panel__button--text">Filter</p>
    </div>
  )
}
const Create = () => {
  return (
    <div className="controls__panel__button">
      <AddIcon />
      <p className="controls__panel__button--text">Create</p>
    </div>
  )
}
const Export = () => {
  return (
    <div className="controls__panel__button">
      <GetAppIcon />
      <p className="controls__panel__button--text">Export</p>
    </div>
  )
}
