package com.example.system.services;

import com.example.system.entities.Address;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public Address createAddress(Address address) {
        // Валидация (если необходимо)
        return addressRepository.save(address);
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    public Address getAddressById(Integer id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Адрес с ID " + id + " не найден"));
    }

    public Address updateAddress(Integer id, Address updatedAddress) {
        // Валидация (если необходимо)
        return addressRepository.findById(id)
                .map(address -> {
                    address.setZipCode(updatedAddress.getZipCode());
                    address.setTown(updatedAddress.getTown());
                    return addressRepository.save(address);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Адрес с ID " + id + " не найден"));
    }

    public void deleteAddress(Integer id) {
        addressRepository.deleteById(id);
    }
}