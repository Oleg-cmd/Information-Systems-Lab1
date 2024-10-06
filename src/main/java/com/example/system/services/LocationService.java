package com.example.system.services;

import com.example.system.entities.Location;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LocationService {

    private final LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location createLocation(Location location) {
        validateLocation(location);
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Integer id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Местоположение с ID " + id + " не найдено"));
    }

    public Location updateLocation(Integer id, Location updatedLocation) {
        validateLocation(updatedLocation);
        return locationRepository.findById(id)
                .map(location -> {
                    location.setX(updatedLocation.getX());
                    location.setY(updatedLocation.getY());
                    location.setZ(updatedLocation.getZ());
                    return locationRepository.save(location);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Местоположение с ID " + id + " не найдено"));
    }

    public void deleteLocation(Integer id) {
        locationRepository.deleteById(id);
    }
    
    private void validateLocation(Location location) {
        if (location.getY() == null) {
            throw new IllegalArgumentException("Координата Y локации не может быть null");
        }
        if (location.getZ() == null) {
            throw new IllegalArgumentException("Координата Z локации не может быть null");
        }
    }
}