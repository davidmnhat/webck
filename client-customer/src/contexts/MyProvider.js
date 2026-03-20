import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      customer: null,
      mycart: []
    };
  }

  // --- QUAN TRỌNG: THÊM ĐOẠN NÀY ĐỂ F5 KHÔNG MẤT ĐĂNG NHẬP ---
  componentDidMount() {
    if (typeof(Storage) !== 'undefined') {
      const token = localStorage.getItem('token');
      const customer = localStorage.getItem('customer');
      
      // Nếu trong kho có dữ liệu thì nạp lại vào web
      if (token && customer) {
        this.setState({
          token: token,
          customer: JSON.parse(customer) // Chuyển chuỗi JSON ngược lại thành Object
        });
      }
    }
  }
  // -----------------------------------------------------------

  setToken = (value) => { this.setState({ token: value }); }
  setCustomer = (value) => { this.setState({ customer: value }); }

  // 1. THÊM VÀO GIỎ
  addToCart = (item, quantity = 1, color = '', memory = '') => {
    let mycart = this.state.mycart;
    // Tìm xem món hàng này + màu này + bộ nhớ này đã có trong giỏ chưa
    const index = mycart.findIndex(x => x.product._id === item._id && x.color === color && x.memory === memory);
    
    if (index === -1) {
      // Nếu chưa có thì thêm mới
      const newItem = { product: item, quantity: quantity, color: color, memory: memory };
      mycart.push(newItem);
    } else {
      // Nếu có rồi thì cộng dồn số lượng
      mycart[index].quantity += quantity;
    }
    
    this.setState({ mycart: mycart });
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
  }

  // 2. XÓA KHỎI GIỎ HÀNG
  removeFromCart = (item) => {
    let mycart = this.state.mycart;
    const index = mycart.findIndex(x => x.product._id === item.product._id && x.color === item.color && x.memory === item.memory);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.setState({ mycart: mycart });
    }
  }

  // 3. CẬP NHẬT SỐ LƯỢNG
  updateCart = (item, quantity) => {
    let mycart = this.state.mycart;
    const index = mycart.findIndex(x => x.product._id === item.product._id && x.color === item.color && x.memory === item.memory);
    if (index !== -1) {
      mycart[index].quantity = quantity;
      this.setState({ mycart: mycart });
    }
  }

  // 4. XÓA SẠCH GIỎ HÀNG (Dùng khi chốt đơn xong)
  clearCart = () => {
    this.setState({ mycart: [] });
  }

  render() {
    return (
      <MyContext.Provider value={{
        token: this.state.token,
        customer: this.state.customer,
        mycart: this.state.mycart,
        setToken: this.setToken,
        setCustomer: this.setCustomer,
        addToCart: this.addToCart,
        removeFromCart: this.removeFromCart,
        updateCart: this.updateCart,
        clearCart: this.clearCart
      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;