import React, { useState } from 'react';
import {
  Button,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tabs,
  Tab,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const initialData = [
  { id: 1, deviceModel: 'Model 1', name: 'Device A', unitPrice: 10, quantity: 0, totalValue: 0 },
  { id: 2, deviceModel: 'Model 2', name: 'Device B', unitPrice: 23, quantity: 0, totalValue: 0 },
  { id: 3, deviceModel: 'Model 3', name: 'Device C', unitPrice: 54, quantity: 0, totalValue: 0 },
  { id: 4, deviceModel: 'Model 4', name: 'Device D', unitPrice: 33, quantity: 0, totalValue: 0 },
  { id: 5, deviceModel: 'Model 5', name: 'Device E', unitPrice: 765, quantity: 0, totalValue: 0 },
  { id: 6, deviceModel: 'Model 6', name: 'Device F', unitPrice: 1200, quantity: 0, totalValue: 0 },
];

const App = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [count, setCount] = useState(1);
  const [unitPrice, setUnitPrice] = useState(10);
  const [transferLocation, setTransferLocation] = useState('home');
  const [tableData, setTableData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (event, item) => {
    setSelectedItem(item);
    setUnitPrice(item.unitPrice); // Set the unit price of the selected item
    setCount(item.quantity); // Set the quantity of the selected item
    setAnchorEl(event.currentTarget);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCountChange = (event) => {
    const newCount = parseInt(event.target.value);
    setCount(newCount);
    if (selectedItem) {
      setUnitPrice(newCount * selectedItem.unitPrice);
    } else {
      setUnitPrice(newCount * 10); // Assuming unit price is 10 dollars
    }
  };

  const handleTransferLocationChange = (event) => {
    setTransferLocation(event.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);

    new Promise((resolve) => {
      setTimeout(() => {
        const newPrice = count * unitPrice;
        const newUnitPrice = unitPrice;

        const updatedTableData = tableData.map((item) => {
          if (item === selectedItem) {
            return { ...item, quantity: count, totalValue: newPrice, unitPrice: newUnitPrice };
          }
          return item;
        });

        setTableData(updatedTableData);

        toast.success('Successfully updated!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setAnchorEl(null);
        resolve();
      }, 1000);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handleDeleteClick = (id) => {
    const updatedTableData = tableData.filter((item) => item.id !== id);
    toast.success('Successfully deleted!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTableData(updatedTableData);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <TableContainer  component={Paper} sx={{ borderRadius: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Model</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Edit/Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.deviceModel}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.totalValue}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => handleEditClick(event, item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    className="delete-button"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className="custom-popover">
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab style={{ position: 'relative', textTransform: 'capitalize' }} label="RMA" />
            <Tab style={{ position: 'relative', textTransform: 'capitalize' }} label="Claim damaged product" />
            <Tab style={{ position: 'relative', textTransform: 'capitalize' }} label="Transfer" />
          </Tabs>
          <div className="input-container">
            <div className="quantity-container">
              <Button
                onClick={() => setCount(Math.max(0, count - 1))}
                variant="outlined"
              >
                -
              </Button>
              <TextField
                label="Quantity"
                value={count}
                onChange={handleCountChange}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
              <Button onClick={() => setCount(count + 1)} variant="outlined">
                +
              </Button>
            </div>
            <TextField
              label="Unit Price"
              value={selectedItem ? selectedItem.unitPrice : ""}
              disabled
            />
            <TextField
              label="Total Value"
              value={selectedItem ? selectedItem.totalValue : ""}
              disabled
            />
            {tabValue === 2 && (
              <Select
                value={transferLocation}
                onChange={handleTransferLocationChange}
              >
                <MenuItem style={{ textTransform: 'capitalize' }} value="home">Home</MenuItem>
                <MenuItem style={{ textTransform: 'capitalize' }} value="work">Work</MenuItem>
                <MenuItem style={{ textTransform: 'capitalize' }} value="other">Other</MenuItem>
              </Select>
            )}
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isLoading}
              style={{ position: 'relative', textTransform: 'capitalize' }}
            >
              {isLoading && <div className="loader"></div>}
              {isLoading ? "Loading..." : (
                tabValue === 0 ? "Return" : tabValue === 1 ? "Claim" : "Transfer"
              )}
            </Button>
          </div>
        </div>
      </Popover>
      <ToastContainer />
    </div>
  );
};

export default App;
