import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Select,
  message,
  TimePicker,
  Checkbox,
  Upload,
  Space,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { baseUrl } from "../base/baseUrl";
import { ImagetoBase64 } from "../utitlity/ImagetoBase64";
import HeadingPage from "./HeadingPage";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select;

const AddTour = ({ updateMode = false, tourData = {}, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [endCities, setEndCities] = useState([]);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=2")
      .then((response) => {
        setCities(response.data);
        setEndCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces data:", error);
      });
  }, []);

  useEffect(() => {
    if (updateMode && tourData && Array.isArray(tourData.inforTourDetail)) {
      form.setFieldsValue({
        inforTourDetail: Array.isArray(tourData.inforTourDetail)
          ? tourData.inforTourDetail.map((detail) => ({
              price: detail.price.price,
              priceChildren: detail.price.priceChildren,
              priceBaby: detail.price.priceBaby,
              time: [
                detail.time.startDate && moment(detail.time.startDate).isValid()
                  ? moment(detail.time.startDate)
                  : null,
                detail.time.endDate && moment(detail.time.endDate).isValid()
                  ? moment(detail.time.endDate)
                  : null,
              ],
              fightTime: [
                detail.fightTime.startTime &&
                moment(detail.fightTime.startTime, "HH:mm").isValid()
                  ? moment(detail.fightTime.startTime, "HH:mm")
                  : null,
                detail.fightTime.endTime &&
                moment(detail.fightTime.endTime, "HH:mm").isValid()
                  ? moment(detail.fightTime.endTime, "HH:mm")
                  : null,
              ],
              fightBackTime: [
                detail.fightBackTime.startBackTime &&
                moment(detail.fightBackTime.startBackTime, "HH:mm").isValid()
                  ? moment(detail.fightBackTime.startBackTime, "HH:mm")
                  : null,
                detail.fightBackTime.endBackTime &&
                moment(detail.fightBackTime.endBackTime, "HH:mm").isValid()
                  ? moment(detail.fightBackTime.endBackTime, "HH:mm")
                  : null,
              ],
              slot: detail.slot,
            }))
          : [],
      });
    }
  }, [updateMode, tourData]);

  const convertToSlug = (text) => {
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    return removeAccents(text)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleValuesChange = (changedValues) => {
    const title = changedValues.title;
    if (title) {
      const slug = convertToSlug(title);
      form.setFieldsValue({ slug });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const inforTourDetails = values?.inforTourDetail?.map((detail) => ({
      price: {
        price: detail.price,
        priceBaby: detail.priceBaby,
        priceChildren: detail.priceChildren,
      },
      time: {
        startDate: detail.time ? detail.time[0].format("YYYY-MM-DD") : "",
        endDate: detail.time ? detail.time[1].format("YYYY-MM-DD") : "",
      },
      fightTime: {
        startTime: detail.fightTime
          ? detail.fightTime[0].format("HH:mm")
          : null,
        endTime: detail.fightTime ? detail.fightTime[1].format("HH:mm") : null,
      },
      fightBackTime: {
        startBackTime: detail.fightBackTime
          ? detail.fightBackTime[0].format("HH:mm")
          : null,
        endBackTime: detail.fightBackTime
          ? detail.fightBackTime[1].format("HH:mm")
          : null,
      },
      slot: detail.slot,
    }));

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("slug", convertToSlug(values.title));
    formData.append("city", values.city);
    formData.append("endCity", values.endCity);
    formData.append("vehicle", values.vehicle);
    formData.append("hotel", values.hotel);
    formData.append("typeCombo", values.typeCombo);
    formData.append("combo", values.combo);

    // Chuyển inforTourDetail thành chuỗi JSON nếu nó là một đối tượng
    formData.append("inforTourDetail", JSON.stringify(inforTourDetails));

    // Thêm các ảnh vào formData
    fileList.forEach((file) => {
      formData.append("images", file.originFileObj);
    });
    try {
      if (updateMode) {
        const response = await axios.put(
          `${baseUrl}tour/update-tour/${tourData._id}`,
          formData
        );
        console.log(response);
        message.success("Tour updated successfully!");
        closeModal();
      } else {
        await axios.post(`${baseUrl}tour/add-tour`, formData);
        message.success("Tour added successfully!");
      }
      setFileList([]);
      form.resetFields();
    } catch (error) {
      message.error("There was an error adding the tour!");
      console.error("Error adding tour:", error);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <HeadingPage title={updateMode ? "Cập nhật tour" : "Thêm tour mới"} />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        initialValues={{
          title: tourData?.title || "",
          slug: tourData?.slug || "",
          city: tourData?.city || "",
          endCity: tourData?.endCity || "",
          vehicle: tourData?.vehicle || "",
          hotel: tourData?.hotel || "",
          typeCombo: tourData?.typeCombo || "",
          combo: tourData?.combo || false,
        }}
      >
        {/* Title */}
        <Form.Item
          label="Tiêu đề tour"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề tour!" }]}
        >
          <Input placeholder="Nhập tiêu đề tour" />
        </Form.Item>
        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Vui lòng nhập slug tour!" }]}
        >
          <Input placeholder="Nhập slug tour" />
        </Form.Item>

        {/* City */}
        <Form.Item
          label="Thành phố"
          name="city"
          rules={[{ required: true, message: "Vui lòng chọn thành phố!" }]}
        >
          <Select placeholder="Chọn thành phố">
            {cities.map((city) => (
              <Option key={city.name} value={city.name}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Thành phố kết thúc"
          name="endCity"
          rules={[
            { required: true, message: "Vui lòng chọn thành phố kết thúc!" },
          ]}
        >
          <Select placeholder="Chọn thành phố kết thúc">
            {endCities.map((city) => (
              <Option key={city.code} value={city.name}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Images */}
        <Row gutter={16}>
          <Form.Item label="Images">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<PlusOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>
        </Row>

        {/* inforTourDetail */}
        <Form.List name="inforTourDetail">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div
                  key={key}
                  style={{
                    border: "1px solid #d9d9d9",
                    padding: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <h3>Tour Detail #{key + 1}</h3>
                    </Col>
                    <Col>
                      <MinusCircleOutlined
                        style={{ fontSize: "20px", color: "red" }}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                  {/* Details for each inforTourDetail */}
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        fieldKey={[fieldKey, "price"]}
                        label="Giá người lớn"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá người lớn!",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập giá người lớn" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "priceChildren"]}
                        fieldKey={[fieldKey, "priceChildren"]}
                        label="Giá trẻ em"
                      >
                        <Input placeholder="Nhập giá trẻ em" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "priceBaby"]}
                        fieldKey={[fieldKey, "priceBaby"]}
                        label="Giá trẻ sơ sinh"
                      >
                        <Input placeholder="Nhập giá trẻ sơ sinh" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    {...restField}
                    name={[name, "time"]}
                    fieldKey={[fieldKey, "time"]}
                    label="Thời gian"
                    rules={[
                      { required: true, message: "Vui lòng chọn thời gian!" },
                    ]}
                  >
                    <RangePicker />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "fightTime"]}
                    fieldKey={[fieldKey, "fightTime"]}
                    label="Thời gian đi"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian đi!",
                      },
                    ]}
                  >
                    <TimePicker.RangePicker format="hh:mm" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "fightBackTime"]}
                    fieldKey={[fieldKey, "fightBackTime"]}
                    label="Thời gian về"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian về!",
                      },
                    ]}
                  >
                    <TimePicker.RangePicker format="hh:mm" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "slot"]}
                    fieldKey={[fieldKey, "slot"]}
                    label="Số lượng chỗ"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng chỗ!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số lượng chỗ" />
                  </Form.Item>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm chi tiết tour
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          label="Phương tiện"
          name="vehicle"
          rules={[{ required: true, message: "Vui lòng nhập phương tiện!" }]}
        >
          <Select placeholder="Chọn loại phương tiện">
            <Option value="Xe">Xe</Option>
            <Option value="Máy bay">Máy bay</Option>
          </Select>
        </Form.Item>
        {/* Hotel */}
        <Form.Item
          label="Khách sạn"
          name="hotel"
          rules={[{ required: true, message: "Vui lòng nhập khách sạn!" }]}
        >
          <Input placeholder="Nhập khách sạn" />
        </Form.Item>

        {/* TypeCombo */}
        <Form.Item
          label="Loại Combo"
          name="typeCombo"
          rules={[{ required: true, message: "Vui lòng chọn loại combo!" }]}
        >
          <Select placeholder="Chọn loại combo">
            <Option value="Tiêu chuẩn">Tiêu chuẩn</Option>
            <Option value="Cao cấp">Cao cấp</Option>
            <Option value="Tiết kiệm">Tiết kiệm</Option>
            <Option value="Giá tốt">Giá tốt</Option>
          </Select>
        </Form.Item>
        <Form.Item name="combo" valuePropName="checked">
          <Checkbox>Là tour có combo</Checkbox>
        </Form.Item>
        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ marginTop: "20px" }}
          >
            {updateMode ? "Cập nhật tour" : "Thêm tour mới"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTour;
