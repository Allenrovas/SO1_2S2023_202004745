// Code generated by protoc-gen-go. DO NOT EDIT.
// source: client.proto

package confproto

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type RequestId struct {
	Carnet               int32    `protobuf:"varint,1,opt,name=carnet,proto3" json:"carnet,omitempty"`
	Nombre               string   `protobuf:"bytes,2,opt,name=nombre,proto3" json:"nombre,omitempty"`
	Curso                string   `protobuf:"bytes,3,opt,name=curso,proto3" json:"curso,omitempty"`
	Nota                 int32    `protobuf:"varint,4,opt,name=nota,proto3" json:"nota,omitempty"`
	Semestre             string   `protobuf:"bytes,5,opt,name=semestre,proto3" json:"semestre,omitempty"`
	Year                 int32    `protobuf:"varint,6,opt,name=year,proto3" json:"year,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *RequestId) Reset()         { *m = RequestId{} }
func (m *RequestId) String() string { return proto.CompactTextString(m) }
func (*RequestId) ProtoMessage()    {}
func (*RequestId) Descriptor() ([]byte, []int) {
	return fileDescriptor_014de31d7ac8c57c, []int{0}
}

func (m *RequestId) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_RequestId.Unmarshal(m, b)
}
func (m *RequestId) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_RequestId.Marshal(b, m, deterministic)
}
func (m *RequestId) XXX_Merge(src proto.Message) {
	xxx_messageInfo_RequestId.Merge(m, src)
}
func (m *RequestId) XXX_Size() int {
	return xxx_messageInfo_RequestId.Size(m)
}
func (m *RequestId) XXX_DiscardUnknown() {
	xxx_messageInfo_RequestId.DiscardUnknown(m)
}

var xxx_messageInfo_RequestId proto.InternalMessageInfo

func (m *RequestId) GetCarnet() int32 {
	if m != nil {
		return m.Carnet
	}
	return 0
}

func (m *RequestId) GetNombre() string {
	if m != nil {
		return m.Nombre
	}
	return ""
}

func (m *RequestId) GetCurso() string {
	if m != nil {
		return m.Curso
	}
	return ""
}

func (m *RequestId) GetNota() int32 {
	if m != nil {
		return m.Nota
	}
	return 0
}

func (m *RequestId) GetSemestre() string {
	if m != nil {
		return m.Semestre
	}
	return ""
}

func (m *RequestId) GetYear() int32 {
	if m != nil {
		return m.Year
	}
	return 0
}

type ReplyInfo struct {
	Info                 string   `protobuf:"bytes,1,opt,name=info,proto3" json:"info,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *ReplyInfo) Reset()         { *m = ReplyInfo{} }
func (m *ReplyInfo) String() string { return proto.CompactTextString(m) }
func (*ReplyInfo) ProtoMessage()    {}
func (*ReplyInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_014de31d7ac8c57c, []int{1}
}

func (m *ReplyInfo) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ReplyInfo.Unmarshal(m, b)
}
func (m *ReplyInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ReplyInfo.Marshal(b, m, deterministic)
}
func (m *ReplyInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ReplyInfo.Merge(m, src)
}
func (m *ReplyInfo) XXX_Size() int {
	return xxx_messageInfo_ReplyInfo.Size(m)
}
func (m *ReplyInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_ReplyInfo.DiscardUnknown(m)
}

var xxx_messageInfo_ReplyInfo proto.InternalMessageInfo

func (m *ReplyInfo) GetInfo() string {
	if m != nil {
		return m.Info
	}
	return ""
}

func init() {
	proto.RegisterType((*RequestId)(nil), "confproto.requestId")
	proto.RegisterType((*ReplyInfo)(nil), "confproto.replyInfo")
}

func init() { proto.RegisterFile("client.proto", fileDescriptor_014de31d7ac8c57c) }

var fileDescriptor_014de31d7ac8c57c = []byte{
	// 219 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x54, 0x8f, 0x31, 0x4b, 0x03, 0x41,
	0x10, 0x85, 0x3d, 0xcd, 0x9d, 0xee, 0x10, 0x2c, 0x96, 0x20, 0x4b, 0x1a, 0xc3, 0x55, 0xa9, 0x56,
	0xd0, 0x4e, 0x3b, 0xc1, 0x22, 0xed, 0x95, 0x76, 0x97, 0x75, 0x4e, 0x02, 0xc9, 0x6c, 0x9c, 0x9d,
	0x2b, 0xf2, 0x43, 0xfc, 0xbf, 0xb2, 0x73, 0xc7, 0x82, 0xd5, 0xbc, 0xef, 0xcd, 0xe3, 0x31, 0x03,
	0xcb, 0x70, 0x3c, 0x20, 0x89, 0x3f, 0x73, 0x94, 0x68, 0x4d, 0x88, 0x34, 0xa8, 0x6c, 0x7f, 0x2b,
	0x30, 0x8c, 0x3f, 0x23, 0x26, 0xd9, 0x7d, 0xd9, 0x07, 0x68, 0x42, 0xcf, 0x84, 0xe2, 0xaa, 0x4d,
	0xb5, 0xad, 0xbb, 0x99, 0xb2, 0x4f, 0xf1, 0xb4, 0x67, 0x74, 0xd7, 0x9b, 0x6a, 0x6b, 0xba, 0x99,
	0xec, 0x0a, 0xea, 0x30, 0x72, 0x8a, 0xee, 0x46, 0xed, 0x09, 0xac, 0x85, 0x05, 0x45, 0xe9, 0xdd,
	0x42, 0x3b, 0x54, 0xdb, 0x35, 0xdc, 0x25, 0x3c, 0x61, 0x12, 0x46, 0x57, 0x6b, 0xb8, 0x70, 0xce,
	0x5f, 0xb0, 0x67, 0xd7, 0x4c, 0xf9, 0xac, 0xdb, 0xc7, 0x7c, 0xd6, 0xf9, 0x78, 0xd9, 0xd1, 0xa0,
	0x85, 0x07, 0x1a, 0xa2, 0x1e, 0x65, 0x3a, 0xd5, 0xcf, 0x1f, 0x70, 0xfb, 0x8d, 0xa2, 0xeb, 0x57,
	0x00, 0x46, 0x19, 0x99, 0x94, 0x56, 0xbe, 0x7c, 0xe7, 0xcb, 0x67, 0xeb, 0xff, 0xee, 0x5c, 0xdc,
	0x5e, 0xbd, 0xdf, 0x7f, 0x2e, 0xfd, 0xd3, 0x5b, 0xd9, 0xed, 0x1b, 0x1d, 0x2f, 0x7f, 0x01, 0x00,
	0x00, 0xff, 0xff, 0xef, 0x81, 0xe0, 0x2a, 0x31, 0x01, 0x00, 0x00,
}
